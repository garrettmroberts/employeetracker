const mysql = require("mysql");

// Connection is saved as a variable
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "BlueBird36!",
  database: "employeeTrackerDB"
});

// Opens connection to DB
connection.connect(function (err) {
  if (err) throw err;
  console.log("Server listening on id " + connection.threadId);
});

module.exports = {
  connection
}