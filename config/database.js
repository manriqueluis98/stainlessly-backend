const config = require("./index");

const db = config.db;
const username = db.username;
const password = db.password;
const host = db.host;
const database = db.database;

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
