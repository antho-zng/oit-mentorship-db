const Sequelize = require("sequelize");
const db = require("../db");
module.exports = db.define(
  "cohort",
  {
    cohortId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    menteeApplicationFormID: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isCurrent: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "cohorts",
  }
);
