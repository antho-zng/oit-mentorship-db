const Sequelize = require('sequelize');
const db = require('../db');
module.exports = db.define(
  'question',
  {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['text'],
      },
    ],
  }
);
