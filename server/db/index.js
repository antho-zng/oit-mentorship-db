//this is the access point for all things database related!

const db = require('./db');

const User = require('./models/User');
const Mentee = require('./models/Mentee');
const Question = require('./models/Question');
const Answer = require('./models/Answer');
const Cohort = require('./models/Cohort');

// ASSOCIATIONS
Mentee.belongsToMany(Question, { through: Answer });
Question.belongsToMany(Mentee, { through: Answer });
Mentee.belongsTo(Cohort, { foreignKey: 'cohortId' });
Cohort.hasMany(Mentee, { foreignKey: 'cohortId' });

module.exports = {
  db,
  models: {
    User,
    Mentee,
    Question,
    Answer,
    Cohort,
  },
};
