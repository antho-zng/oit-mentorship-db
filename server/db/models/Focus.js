const Sequelize = require('sequelize');
const db = require('../db');
module.exports = db.define('focus', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  priority: {
    type: Sequelize.ENUM('Primary', 'Secondary'),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});
