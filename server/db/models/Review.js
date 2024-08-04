const Sequelize = require("sequelize");
const db = require("../db");
module.exports = db.define(
  "review",
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
      get() {
        const rawValue = this.getDataValue("reviewerScore");
        return rawValue !== null ? parseInt(rawValue, 10) : null;
      },
    },
    submitStatus: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["reviewerScore"],
      },
    ],
  }
);
