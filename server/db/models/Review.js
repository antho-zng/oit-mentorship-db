const Sequelize = require('sequelize');
const db = require('../db');
module.exports = db.define(
  'review',
  {
    reviewerComments: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    reviewerScore: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    submitStatus: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ['reviewerScore'],
      },
    ],
  }
);
