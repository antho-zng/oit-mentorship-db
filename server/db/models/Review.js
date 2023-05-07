const Sequelize = require('sequelize');
const db = require('../db');
module.exports = db.define('reviews', {
  reviewerOneComments: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  reviewerTwoComments: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  reviewerOneScore: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  reviewerTwoScore: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});
