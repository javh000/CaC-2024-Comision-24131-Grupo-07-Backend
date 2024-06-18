const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "store_catalog",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to de database");
    return;
  }
  console.log("Connecting to de database");
});

module.exports = connection;
