const MENTEE_INFO_INDEXES = {
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

const SCORE_KEY = {
  1: "NOT ACCEPTED",
  2: "WAITLIST",
  3: "LOW PRIORITY ACCEPT",
  4: "ACCEPTED",
  5: "STRONG ACCEPT",
};

const GOOGLE_SHEETS_RANGE_FOR_RESPONSES = "A:AK";
const QUESTIONS_ROW_INDEX_FOR_RESPONSES = 0;

module.exports = {
  MENTEE_INFO_INDEXES,
  SCORE_KEY,
  GOOGLE_SHEETS_RANGE_FOR_RESPONSES,
  QUESTIONS_ROW_INDEX_FOR_RESPONSES,
  FIRST_MENTEE_INDEX,
};
