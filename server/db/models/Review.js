const Sequelize = require('sequelize');
const db = require('../db');
module.exports = db.define(
  'review',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
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
