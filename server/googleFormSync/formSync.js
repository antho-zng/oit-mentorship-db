// Import dependencies
const fs = require('fs');
const { google } = require('googleapis');
const service = google.sheets('v4');
const Sequelize = require('sequelize');
const {
  db,
  models: { Mentee, Question, Answer, Cohort },
} = require('../db');
require('dotenv').config();

const menteeInfoIndexes = {
  firstNameIndex: 2,
  lastNameIndex: 3,
  pronounsIndex: 6,
  emailIndex: 1,
  phoneNumIndex: 5,
  dobIndex: 4,
  locationIndex: 7,
  gendersAndSexualitiesIndex: 8,
  raceEthnicityIndex: 9,
};

// Configure auth client
const authClient = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

async function googleAuth() {
  // Authorize the client
  const token = await authClient.authorize();

  // Set the client credentials
  authClient.setCredentials(token);
}

// take data from Google Forms and push to Mentees array
async function getMenteeData(rows, cohortId) {
  const mentees = [];

  for (const rowIdx in rows) {
    const row = rows[rowIdx];

    mentees.push({
      id: `MENTEE-${cohortId}-${rowIdx}`,
      firstName: row[menteeInfoIndexes[`firstNameIndex`]],
      lastName: row[menteeInfoIndexes['lastNameIndex']],
      pronouns: row[menteeInfoIndexes['pronounsIndex']].split(','),
      email: row[menteeInfoIndexes['emailIndex']],
      phoneNum: row[menteeInfoIndexes['phoneNumIndex']],
      dateOfBirth: row[menteeInfoIndexes['dobIndex']],
      location: row[menteeInfoIndexes['locationIndex']],
      gendersAndSexualities:
        row[menteeInfoIndexes['gendersAndSexualitiesIndex']].split(','),
      raceEthnicity: row[menteeInfoIndexes['raceEthnicityIndex']].split(','),
    });
  }
  console.log(`${mentees.length} mentees found... writing to database!`);
  return mentees;
}

async function getResponseData(rows) {
  const answers = [];

  const questions = rows[0];
  rows.shift();

  for (const row of rows) {
    const menteeResponses = {};

    for (const responseNum in row) {
      if (row[responseNum] === '') {
        row[responseNum] = 'n/a';
      }
      menteeResponses[questions[responseNum]] = row[responseNum];
    }

    answers.push(menteeResponses);
  }
  return answers;
}

async function bulkCreateQuestions(rows) {
  // save headers as questions
  const questionsRow = rows[0];
  const questions = [];

  for (const question of questionsRow) {
    questions.push({ text: question.toString() });
  }

  await Question.bulkCreate(questions, { ignoreDuplicates: true }).then(() =>
    console.log(`${questions.length} questions have been written into DB!`)
  );
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
  let rows = {};
  const spreadsheetID = cohort.menteeApplicationFormID;
  const cohortId = cohort.cohortId;

  try {
    const res = await service.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: spreadsheetID,
      range: 'A:AK', // TO-DO : fix magic number here
    });

    // Set rows to equal the rows
    rows = res?.data?.values;

    if (!rows || rows.length === 0) {
      console.log('No data returned from Google Sheets! :(');
      return;
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  bulkCreateQuestions(rows);
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
      console.log(`Error: ${error}`);
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
    console.log('Current cohort not found!');
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
    `Syncing with Google Forms for the ${currentCohort.name} mentee cohort!
    Spreadsheet ID is ${currentCohort.menteeApplicationFormID}`
  );
  await createMenteeQATransactions(currentCohort);
  console.log(`Finished syncing ${currentCohort.name} mentee applications!`);
}

if (module === require.main) {
  runFormSync();
}
