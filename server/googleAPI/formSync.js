// Import dependencies
const fs = require('fs');
const { google } = require('googleapis');
const {
  db,
  models: { User, Mentee, Focus },
} = require('../db');

const menteeAppSpreadsheetID = '1TZtuj7JbPp4OGFem9Ha1EmnckFT9g-pAHVsl4mrNfII';
const cohort = 'fall2023';
const service = google.sheets('v4');
const credentials = require('./googleCredentials.json');

// take data from Google Forms and push to Mentees array
async function readGoogleFormsMenteesData() {
  // array for all mentees
  const mentees = [];

  // Configure auth client
  const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  try {
    // Authorize the client
    const token = await authClient.authorize();

    // Set the client credentials
    authClient.setCredentials(token);

    // Get the rows
    const res = await service.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: menteeAppSpreadsheetID,
      range: 'A:AK',
    });

    // Set rows to equal the rows
    const rows = res.data.values;
    const resData = res.data;
    console.log(resData);

    // Check if we have any data and if we do add it to our answers array
    if (rows.length) {
      // save headers as keys
      const questions = rows[0];

      // Remove the headers
      rows.shift();

      // For each row
      for (const row of rows) {
        mentees.push({
          firstName: row[2],
          lastName: row[3],
          pronouns: row[6],
          email: row[1],
          phoneNum: row[5],
          dateOfBirth: row[4],
          location: row[7],
          genSexID: row[8],
          raceEthnicity: row[9],
          cohort: cohort,
        });
      }
      console.log('Mentees added to array!');
      return mentees;
    } else {
      console.log('No data found.');
    }
  } catch (error) {
    // Log the error
    console.log(error);

    // Exit the process with error
    process.exit(1);
  }
}

async function cleanGoogleFormsData() {}

// take Mentees array and write Mentees into DB
async function bulkCreateMentees() {
  const mentees = await readGoogleFormsMenteesData();
  Mentee.bulkCreate(mentees, { ignoreDuplicates: true }).then(() =>
    console.log(`${mentees.length} mentees have been written into DB!`, mentees)
  );
}

// TO-DO: rewrite formsSync to bring together above three functions
(async function formsSync() {
  // Configure auth client
  const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  try {
    // Authorize the client
    const token = await authClient.authorize();

    // Set the client credentials
    authClient.setCredentials(token);

    // Get the rows
    const res = await service.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: '1TZtuj7JbPp4OGFem9Ha1EmnckFT9g-pAHVsl4mrNfII',
      range: 'A:AK',
    });

    // All of the answers
    const answers = [];

    // Set rows to equal the rows
    const rows = res.data.values;

    // Check if we have any data and if we do add it to our answers array
    if (rows.length) {
      // save headers as keys
      const questions = rows[0];

      // Remove the headers
      rows.shift();

      // For each row
      for (const row of rows) {
        answers.push({
          [questions[0]]: row[0],
          [questions[1]]: row[1],
          [questions[2]]: row[2],
          [questions[3]]: row[3],
          [questions[4]]: row[4],
          [questions[5]]: row[5],
          [questions[6]]: row[6],
          [questions[7]]: row[7],
          [questions[8]]: row[8],
          [questions[9]]: row[9],
          [questions[10]]: row[10],
          [questions[11]]: row[11],
          [questions[12]]: row[12],
          [questions[13]]: row[13],
          [questions[14]]: row[14],
          [questions[15]]: row[15],
          [questions[16]]: row[16],
          [questions[17]]: row[17],
          [questions[18]]: row[18],
          [questions[19]]: row[19],
          [questions[20]]: row[20],
          [questions[21]]: row[21],
          [questions[22]]: row[22],
          [questions[23]]: row[23],
          [questions[24]]: row[24],
          [questions[25]]: row[25],
          [questions[26]]: row[26],
          [questions[27]]: row[27],
          [questions[28]]: row[28],
          [questions[29]]: row[29],
          [questions[30]]: row[30],
          [questions[31]]: row[31],
          [questions[32]]: row[32],
          [questions[33]]: row[33],
          [questions[34]]: row[34],
          [questions[35]]: row[35],
          [questions[36]]: row[36],
          [questions[37]]: row[37],
        });
      }
      console.log('Synced with Google Sheets!');
      readGoogleFormsMenteesData();
      bulkCreateMentees();
    } else {
      console.log('No data found.');
    }

    // Saved the answers
    fs.writeFileSync(
      'formsResponses.json',
      JSON.stringify(answers),
      function (err, file) {
        if (err) throw err;
        console.log('Saved!');
      }
    );
  } catch (error) {
    // Log the error
    console.log(error);

    // Exit the process with error
    process.exit(1);
  }
})();

// pull out biographical info (e.g. name dob location, etc)
// pull out long questions + answers and create Question and Answer tables

// save mentee + Q/A (check transitional boundary)

// (google batch save)
// (google transaction boundary / transitional bounadry)
