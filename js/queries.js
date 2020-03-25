// This file creates the connection to the server and builds basic arrays for use in inquirer prompts.
// Import Dependencies
const mysql = require("mysql")
const util = require("util");
// const connection = require("./connection");

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

// const connectAsync = util.promisify(connection.connect).bind(connection);
const queryAsync = util.promisify(connection.query).bind(connection);

// Generates array of departments in database
async function generateDepartmentArray() {
  const result = await queryAsync("SELECT name FROM departments");
  return result.map(dept => dept.name);
};

// Generates employee array from database + a (none)
async function generateEmployeeArray() {
  const result = await queryAsync("SELECT first_name, last_name FROM employees");
  var resultArray = result.map(employee => `${employee.first_name} ${employee.last_name}`);
  resultArray.push("(none)");
  return resultArray;
};

// Generates all roles available in a database
async function generateRolesArray() {
  const result = await queryAsync("SELECT title FROM roles");
  return result.map(role => role.title)
};

module.exports = {
  connection, generateDepartmentArray, generateEmployeeArray, generateRolesArray
};