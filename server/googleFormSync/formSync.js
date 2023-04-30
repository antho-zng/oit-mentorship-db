// Import dependencies
const fs = require('fs');
const { google } = require('googleapis');
const Sequelize = require('sequelize');
const {
  db,
  models: { Mentee, Question, Answer },
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

const menteeAppSpreadsheetID = '1TZtuj7JbPp4OGFem9Ha1EmnckFT9g-pAHVsl4mrNfII';
const cohort = 'fall2023';
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
  console.log(`${mentees.length} Mentees added to array!`);
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

async function createMenteeQATransactions() {
  let rows = {};

  try {
    const res = await service.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: menteeAppSpreadsheetID,
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
        `Transaction successful! Tables for Mentee #${mentee.dataValues.id} created`
      );
      await trx.commit();
    } catch (error) {
      console.log(`Error: ${error}`);
      await trx.rollback();
    }
  }
}

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
      // getMenteeData();
      // bulkCreateMentees();
    } else {
      console.log('No data found.');
    }

    // // Saved the answers
    // fs.writeFileSync(
    //   'formsResponses.json',
    //   JSON.stringify(answers),
    //   function (err, file) {
    //     if (err) throw err;
    //     console.log('Saved!');
    //   }
    // );
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

// getResponseData();
// bulkCreateQuestions();
createMenteeQATransactions();

/*

ANSWER OUTPUT REFERENCE : 

[
  {
    Timestamp: '4/18/2023 12:29:20',
    'Email Address': 'zhang.anthony97@gmail.com',
    'First Name': 'Anthony',
    'Last Name': 'Zhang',
    'Date of birth': '9/29/2000',
    'Phone number': '(238) 394-3940',
    'Pronouns (select all that apply)': 'He/Him/His, They/Them/Theirs',
    'What city do you live in?': 'Los Angeles, CA',
    'How do you identify? ': 'Man, Gender Non-Conforming',
    'What is your race/ethnicity? (Select all that apply) ': 'Asian/Pacific Islander',
    'What language are you most comfortable using? ': 'Mandarin',
    "What's your current academic enrollment / standing?  ": 'Bootcamp / Trade School / Vocational School / Alternative Ed.',
    'What school are you attending, if currently enrolled?': 'Fullstack Academy',
    'Which program are you applying for?': 'North America',
    'Will you be looking for an internship or an entry-level job within the next 6 months? ': "Yes, I'm on the lookout for a new opportunity",
    'What are you hoping to get out of the mentorship program?': 'In linguistic terms, one might say that the figures are distributional but not integrative; they always remain on the same level: the lover speaks in bundles of sentences but does not integrate these sentences on a higher level, into a work; his is a horizontal discourse: no transcen- dence, no deliverance, no novel (though a great deal of the fictive). ',
    'What makes you a unique candidate for this mentorship program?': 'In linguistic terms, one might say that the figures are distributional but not integrative; they always remain on the same level: the lover speaks in bundles of sentences but does not integrate these sentences on a higher level, into a work; his is a horizontal discourse: no transcen- dence, no deliverance, no novel (though a great deal of the fictive). ',
    'What are your areas of interest?': 'Engineering / Coding / Development (building software and/or hardware), Marketing (promoting and advertising to be able to sell tech products), Product Management (planning, forecasting and producing a product)',
    'More specifically, please select any topic you are interested in focusing on during the course of this mentorship:': 'Android development, Data analytics, Game design, iOS development, Web development',
    'Any links with your work? (portfolio, instagram account, twitter, etc.)': 'anthonyzhang.info',
    'Please select the statement that best applies to you:': 'I’m looking for a mentor to help me come up with a project',
    'If you have a specific project in mind that you would like to work on with your mentor, please tell us about it:': 'organized, hierarchized, arranged with a view to an end (a scttlement): there are no first figures, no last figures. To let it be understood that there was no question here of a love story (or of the history of a love), to discourage the temptation of meaning, it was necessary to choose an absolutely insignificant order. Hence we have subjugated the series of figures (inevitable as any series is, since the book is by its stalus obliged to progress) to a pair of arbitrary factors: that of nomination an',
    'Mentees come to this program from all stages in their careers! Please select the statement that best applies to you:': 'I have a pretty clear idea of what I want to do professionally and am looking for a mentor to help provide guidance on how to get there',
    'What specific technical skills you are looking to develop ? ': 'In order to compose this amorous subject, pieces of\n' +
      'various origin have been “put together.” Some come from an ordinary reading, that of Goethe’s Werther. Some come from insistent rcadings',
    'What career skills are you interested in developing throughout the course of this mentorship program?': 'Interviewing, Applying to grad school',
    'Beyond technical and professional skills, are there any other areas you would like your mentor to support you with?': '[ am not invoking guarantees, merely recalling, by a kind of salute given in passing, what has seduced, con- vinced, or what has momentarily given the delight of un- derstanding (of being understood?). Therefore, these reminders of reading, of listening, have been left in the frequently uncertain, incompleted state suitable to a dis- course whose occasion is indeed the memory of the sites (books, encounters) where such and such a thing has been read, spoken, heard. For if the author here lends',
    "Is there anything else you'd like to share with us about your interests? What do you do outside of school/work? Any online communities / clubs you're involved in? Doesn't need to be tech-related!": 'Therefore, on those occasions when I am engulfed, it is because there is no longer any place for me anywhere, not even in death. The image of the other—to which I was glued, on which I lived—no longer exists; sometimes this is a (futile) catastrophe which seems to remove the image forever, sometimes it is an excessive happiness which en- ables me to unite with the image; in any c',
    "Is there anything you'd like us or your mentor to know about how you learn best? Do you need any special accommodations? ": 'Rue du Cherche-Midi, after a difficult evening, X was explaining very carefully, his voice exact, his sentences well-formed, far from anything inexpressible, that some- times he longed to swoon; he regretted never being able to disappear at will.',
    'Is there anything else you think we should know about what you are looking for in a mentor?': '\n' +
      'loved’s absence. And yet this classic figure is not to be found in Werther. The reason is simple: here the loved object (Charlotte) does not move; it is the amorous sub- ject (Werther) who, at a certain moment, departs. Now, absence can exist only as a consequence of the other: it is the other who leaves, it is I who remain. The other is in a condition of perpetual departure, of journcying',
    'Have you participated as a mentee in a previous cohort of the Out in Tech U mentorship program?': 'No',
    'If you were a previous Out in Tech U mentee, which cohort did you participate in?': '',
    'How did you hear about this program? (Select all that apply)': 'Former Out in Tech mentee/mentor referred me, Out in Tech newsletter',
    'If you were referred by a former Out in Tech participant, please specify who:': 'Tin K',
    'If you heard about this from one of our community organization partners please let us know which one': 'Fiesta Youth',
    'Do you grant Out In Tech the consent to use photos, videos, and testimonials during the program for marketing purposes?': 'No',
    'Would you like to receive updates from the Out in Tech U Community via our mailing list (upcoming events, field trips to tech companies...)? ': 'Yes',
    'Do you acknowledge that if selected as a mentee, starting April 11, 2023 you will be meeting with a mentor twice a week for 8 weeks and committing to a total of 3 hours a week to this mentorship program?': 'Yes, I understand!'
  }, ... 
]

*/
