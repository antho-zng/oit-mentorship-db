// Import dependencies
const fs = require("fs");
const {
  db,
  models: { Mentee, Question, Answer, Cohort },
} = require("../db");
const {
  MENTEE_INFO_INDEXES,
  QUESTIONS_ROW_INDEX_FOR_RESPONSES,
} = require("../constants");
require("dotenv").config();
const { fetchGoogleSheetsRows } = require("../services/google-sheets-service");

async function createMenteeFromRow(row, cohortId) {
  return {
    id: `MENTEE-${cohortId}-${crypto.randomUUID()}`,
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
  };
}

async function getMenteeData(rows, cohortId) {
  console.log(`${rows.length} mentees found... writing to database!`);
  const mentees = await Promise.all(
    rows.map((row) => createMenteeFromRow(row, cohortId))
  );
  return mentees;
}

async function getResponseData(rows) {
  const questions = rows[QUESTIONS_ROW_INDEX_FOR_RESPONSES];
  rows.shift();

  const formResponses = rows.map((row) => {
    return questions.reduce((responses, question, idx) => {
      responses[question] = row[idx] !== "" ? row[idx] : "n/a";
      return responses;
    }, {});
  });

  return formResponses;
}

async function bulkCreateQuestions(rows) {
  const questionsRow = rows[QUESTIONS_ROW_INDEX_FOR_RESPONSES];
  const questions = questionsRow.map((question) => {
    return {
      text: question.toString(),
    };
  });
  await Question.bulkCreate(questions, { ignoreDuplicates: true }).then(() =>
    console.log(`${questions.length} questions have been written into DB!`)
  );
}

// We use this to map questions to the corresponding answers
async function createQuestionsMap() {
  const questionsMap = {};
  const allQuestions = await Question.findAll();

  allQuestions.map(
    (question) =>
      (questionsMap[question.dataValues.text] = question.dataValues.id)
  );
  return questionsMap;
}

async function createMenteeQATransactions(cohort) {
  const { menteeApplicationFormID: spreadsheetID, cohortId } = cohort;

  const rows = await fetchGoogleSheetsRows(spreadsheetID);
  if (!rows || rows.length === 0) {
    console.log("No data returned from Google Sheets! :(");
    return;
  }

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

      const mentee = await Mentee.create(
        currentMentee,
        { transaction: trx },
        { ignoreDuplicates: true }
      );

      // CREATE ANSWERS
      await Promise.all(
        currentQuestionSet.map(async (question) => {
          const questionId = questionsMap[question];
          await Answer.create(
            {
              text: currentAnswerSet[question],
              menteeId: mentee.id,
              questionId,
            },
            { transaction: trx },
            { ignoreDuplicates: true }
          );
        })
      );
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
