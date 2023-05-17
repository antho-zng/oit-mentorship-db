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
    // reviewerId: {
    //   type: Sequelize.STRING,
    //   references: {
    //     model: 'users',
    //     key: 'username',
    //   },
    // },
    // menteeId: {
    //   type: Sequelize.STRING,
    //   references: {
    //     model: 'mentees',
    //     key: 'id',
    //   },
    // },
  },
  {
    indexes: [
      {
        fields: ['reviewerScore'],
      },
    ],
  }
);
