// Import dependencies
const fs = require('fs');
const { google } = require('googleapis');
const Sequelize = require('sequelize');
const {
  db,
  models: { Mentee, Question, Answer, Cohort },
} = require('../db');

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

const service = google.sheets('v4');
const credentials = require('./googleCredentials.json');

// Configure auth client
const authClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

async function googleAuth() {
  // Authorize the client
  const token = await authClient.authorize();

  // Set the client credentials
  authClient.setCredentials(token);
}

// take data from Google Forms and push to Mentees array
async function getMenteeData(rows) {
  const mentees = [];

  for (const row of rows) {
    mentees.push({
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
      // cohort: cohort,
      // answers: {q:a, q:a, ...}
    });
  }
  console.log(`${mentees.length} mentees found!`);
  return mentees;
}

async function getResponseData(rows) {
  const answers = [];

  const questions = rows[0];
  rows.shift();

  for (const row of rows) {
    const menteeResponses = {};

    for (const responseNum in row) {
      menteeResponses[questions[responseNum]] = row[responseNum];
    }

    answers.push(menteeResponses);
  }
  return answers;
}

async function bulkCreateQuestions(rows) {
  // save headers as questions
  const headers = rows[0];
  const questions = [];

  for (const question of headers) {
    questions.push({ text: question });
  }

  Question.bulkCreate(questions, { ignoreDuplicates: true }).then(() =>
    console.log(`${questions.length} questions have been written into DB!`)
  );
}

async function createMenteeQATransactions(spreadsheetID) {
  let rows = {};

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

  const answers = await getResponseData(rows);
  const mentees = await getMenteeData(rows);

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
      const mentee = await Mentee.create(
        currentMentee,
        { transaction: trx },
        { ignoreDuplicates: true }
      );

      // CREATE ANSWERS
      // TO-DO : This loop will run one too many loops at the end and return a Sequelize validation error
      for (const answerIndex in currentQuestionSet) {
        const currentQuestion = await Question.findOne({
          where: {
            text: `${currentQuestionSet[answerIndex]}`,
          },
        });

        const questionId = currentQuestion.dataValues.id;

        // TO-DO: create question map, const questionId = questionMap[currentQuestionSet[answerIndex]]

        const answer = await Answer.create(
          {
            text: `${currentAnswerSet[currentQuestion.dataValues.text]}`,
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
  const currentCohortSpreadSheetID = currentCohort.menteeApplicationFormID;
  await createMenteeQATransactions(currentCohortSpreadSheetID);
  console.log(`Finished syncing ${currentCohort.name} mentee applications!`);
}

if (module === require.main) {
  runFormSync();
}
