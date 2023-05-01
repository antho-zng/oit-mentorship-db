const Sequelize = require('sequelize');
const db = require('../db');
module.exports = db.define(
  'mentees',
  {
    // TO-DO: add ID
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    pronouns: {
      type: Sequelize.JSONB,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    phoneNum: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // TO-DO change data type to DATEONLY
    dateOfBirth: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gendersAndSexualities: {
      type: Sequelize.JSONB,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    raceEthnicity: {
      type: Sequelize.JSONB,
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
        fields: ['email'],
      },
    ],
  }
);
