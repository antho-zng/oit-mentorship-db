const Sequelize = require('sequelize');
const db = require('../db');
module.exports = db.define(
  'answer',
  {
    text: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['menteeId', 'questionId'],
      },
    ],
  }
);
