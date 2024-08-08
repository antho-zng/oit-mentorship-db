// Import dependencies
const fs = require("fs");
const {
  db,
  models: { Mentee, Question, Answer, Cohort },
} = require("../db");
const {
  MENTEE_INFO_INDEXES,
  QUESTIONS_ROW_INDEX_FOR_RESPONSES,
  FIRST_MENTEE_INDEX,
} = require("../constants");
require("dotenv").config();
const { fetchGoogleSheetsRows } = require("../services/google-sheets-service");

// take data from Google Forms and push to Mentees array
async function getMenteeData(rows, cohortId) {
  const mentees = [];

  for (const rowIdx in rows) {
    const row = rows[rowIdx];

    mentees.push({
      id: `MENTEE-${cohortId}-${+rowIdx + FIRST_MENTEE_INDEX}`,
      firstName: row[MENTEE_INFO_INDEXES[`firstNameIndex`]],
      lastName: row[MENTEE_INFO_INDEXES["lastNameIndex"]],
      pronouns: row[MENTEE_INFO_INDEXES["pronounsIndex"]].split(","),
      email: row[MENTEE_INFO_INDEXES["emailIndex"]],
      phoneNum: row[MENTEE_INFO_INDEXES["phoneNumIndex"]],
      dateOfBirth: row[MENTEE_INFO_INDEXES["dobIndex"]],
      location: row[MENTEE_INFO_INDEXES["locationIndex"]],
      gendersAndSexualities:
        row[MENTEE_INFO_INDEXES["gendersAndSexualitiesIndex"]].split(","),
      raceEthnicity: row[MENTEE_INFO_INDEXES["raceEthnicityIndex"]].split(","),
    });
  }
  console.log(`${mentees.length} mentees found... writing to database!`);
  return mentees;
}

async function getResponseData(rows) {
  const answers = [];

  const questions = rows[QUESTIONS_ROW_INDEX_FOR_RESPONSES];
  rows.shift();

  for (const row of rows) {
    const menteeResponses = {};

    for (const responseNum in row) {
      if (row[responseNum] === "") {
        row[responseNum] = "n/a";
      }
      menteeResponses[questions[responseNum]] = row[responseNum];
    }

    answers.push(menteeResponses);
  }
  return answers;
}

async function bulkCreateQuestions(rows) {
  // save headers as questions
  const questionsRow = rows[QUESTIONS_ROW_INDEX_FOR_RESPONSES];
  const questions = [];

  for (const question of questionsRow) {
    questions.push({ text: question.toString() });
  }

  await Question.bulkCreate(questions, { ignoreDuplicates: true }).then(() =>
    console.log(`${questions.length} questions have been written into DB!`)
  );

  // console.log(questions)
}

async function createQuestionsMap(rows) {
  const questionsMap = {};
  const allQuestions = await Question.findAll();

  allQuestions.map(
    (question) =>
      (questionsMap[question.dataValues.text] = question.dataValues.id)
  );
  return questionsMap;
}

async function createMenteeQATransactions(cohort) {
  const spreadsheetID = cohort.menteeApplicationFormID;
  const cohortId = cohort.cohortId;

  const rows = await fetchGoogleSheetsRows(spreadsheetID);

  await bulkCreateQuestions(rows);
  const questionsMap = await createQuestionsMap(rows);

  const answers = await getResponseData(rows);
  const mentees = await getMenteeData(rows, cohortId);

  for (const menteeIndex in mentees) {
    const trx = await db.transaction();

    /**
     * currentAnswerSet is object with key value pairs;
     * questions are keys and applicant responses are values
     */

    try {
      const currentAnswerSet = answers[menteeIndex];
      const currentQuestionSet = Object.keys(currentAnswerSet);

      // CREATE MENTEE
      const currentMentee = mentees[menteeIndex];
      currentMentee[`cohortId`] = cohortId;

      // TO-DO : create or update
      const mentee = await Mentee.create(
        currentMentee,
        { transaction: trx },
        { ignoreDuplicates: true }
      );

      // CREATE ANSWERS
      // TO-DO : This loop will run one too many loops at the end and return a Sequelize validation error
      for (const answerIndex in currentQuestionSet) {
        const currentQuestion = currentQuestionSet[answerIndex];
        const questionId = questionsMap[currentQuestion];

        const answer = await Answer.create(
          {
            text: `${currentAnswerSet[currentQuestion]}`,
            menteeId: `${mentee.dataValues.id}`,
            questionId: questionId,
          },
          { transaction: trx },
          { ignoreDuplicates: true }
        );
      }
      console.log(
        `Transaction successful! Tables for Mentee #${mentee.dataValues.id} created.`
      );
      await trx.commit();
    } catch (error) {
      if (error.code === "23505") {
        console.log("Duplicate entry found! Skipping this mentee...");
      } else {
        console.log(`Error: ${error}`);
      }
      await trx.rollback();
    }
  }
}

async function runFormSync() {
  let currentCohort = await Cohort.findAll({
    where: {
      isCurrent: true,
    },
  });

  if (currentCohort === null) {
    console.log("Current cohort not found!");
    return;
  }

  if (currentCohort.length > 1) {
    console.log(
      "Looks like there are multiple cohorts set to 'current'. Please fix this and try again!"
    );
    return;
  } else {
    currentCohort = currentCohort[0];
  }

  console.log(
    `Syncing with Google Forms for the ${currentCohort.name} mentee cohort! Spreadsheet ID is ${currentCohort.menteeApplicationFormID}`
  );
  await createMenteeQATransactions(currentCohort);
  console.log(`Finished syncing ${currentCohort.name} mentee applications!`);
}

if (module === require.main) {
  runFormSync();
}
