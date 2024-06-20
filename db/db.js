require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "javh_store_catalog",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to de database", err);
    return;
  }
  console.log("Connecting to de database");
});

module.exports = connection;
