const { google } = require("googleapis");
const service = google.sheets("v4");
const {
  GOOGLE_SHEETS_RANGE_FOR_RESPONSES,
  QUESTIONS_ROW_INDEX_FOR_RESPONSES,
} = require("../constants");
require("dotenv").config();

const authClient = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

async function googleAuth() {
  const token = await authClient.authorize();
  authClient.setCredentials(token);
}

const fetchGoogleSheetsRows = async (spreadsheetId) => {
  try {
    console.log("service called!");
    const { data } = await service.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: spreadsheetId,
      range: GOOGLE_SHEETS_RANGE_FOR_RESPONSES,
    });

    if (data) {
      const rows = data.values || [];
      return rows;
    }
  } catch (error) {
    console.error("Failed to fetch data from Google Sheets:", error);
    process.exit(1);
  }
};

module.exports = {
  fetchGoogleSheetsRows,
};
