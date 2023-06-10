const Sequelize = require('sequelize');
const db = require('../db');
module.exports = db.define(
  'mentees',
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
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
    dateOfBirth: {
      type: Sequelize.DATEONLY,
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
    acceptedStatus: {
      type: Sequelize.ENUM(
        'PENDING',
        'ACCEPTED',
        'NOT ACCEPTED',
        'STRONG ACCEPT',
        'LOW PRIORITY ACCEPT',
        'WAITLIST'
      ),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      defaultValue: 'PENDING',
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['email', 'cohortId'],
      },
    ],
  }
);
