//this is the access point for all things database related!
const Sequelize = require('sequelize');
const db = require('./db');

const User = require('./models/User');
const Mentee = require('./models/Mentee');
const Question = require('./models/Question');
const Answer = require('./models/Answer');
const Cohort = require('./models/Cohort');
const Review = require('./models/Review');

// ASSOCIATIONS
Mentee.belongsToMany(Question, { through: Answer });
Question.belongsToMany(Mentee, { through: Answer });

// super many-to-many relationship for mentee/user/review
// additional information : https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/

Mentee.belongsToMany(User, { through: Review }, { foreignKey: 'menteeId' });
User.belongsToMany(Mentee, { through: Review }, { foreignKey: 'userId' });
Mentee.hasMany(Review);
Review.belongsTo(Mentee);
User.hasMany(Review);
Review.belongsTo(User);

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
    Review,
  },
};
