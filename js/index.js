// Import dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const util = require("util");

// Connection is saved as a variable
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "BlueBird36!",
  database: "employeeTrackerDB"
});

// Opens connection to DB
connection.connect(function(err) {
  if (err) throw err;
  console.log("Server lsitening on id " + connection.threadId);
  mainLoop();
})

// Main loop takes user input from loop 
function mainLoop() {
  inquirer.prompt({
    type: "list",
    name: "userChoice",
    message: "What would you like to do?",
    choices: ["View all employees", "View departments", "View roles", "Add a department", "View employees by manager", "Add an employee", "Remove an employee", "Update employee role", "Update employee manager", "View all roles", "View all departments", "Exit"]
  }).then(({ userChoice }) => {
    console.log(userChoice)
    switch (userChoice) {
      case "View all employees":
        viewAllEmployees();
        break;
      case "View departments":
         viewAllDepartments();
         break;
      case "View roles":
        viewAllRoles();
        break;
      case "Add a department":
        addDepartment();
        break;
      default:
        connection.end();
    }
    // if (userChoice === "View all employees") {
    //   viewAllEmployees();
    // }
    // switch(userChoice) {
    //   case "View all Employees":
    //     viewAllEmployees();
    //   case "View employees by department":
    //     viewEmployeesByDept();
    // };
    // if (userChoice === "View all employees") {
    //   connect(viewAllEmployees);
    // } else if (userChoice === "View employees by department") {
    //   connect(viewEmployeesByDept);
    // } else if (userChoice === "View employees by manager") {
    //   connect(viewEmployeesByManager);
    // } else if (userChoice === "Add an employee") {
    //   connect(addEmployee);
    // } else if (userChoice === "Remove an employee") {
    //   connect(removeEmployee);
    // } else if (userChoice === "Update employee role") {
    //   updateEmployeeRole();
    // } else if (userChoice === "Update employee manager") {
    //   updateEmployeeManager();
    // } else if (userChoice === "View all roles") {
    //   viewAllRoles();
    // } else if (userChoice === "View all departments") {
    //   viewAllDepartments();
    // } else if (userChoice === "Exit") {
    //   connection.end();
    //   return;
    // };
  });
};


// Shows employee list w/ full names and job title
function viewAllEmployees() {
  const query = `SELECT employees.first_name, employees.last_name, roles.title
  FROM employees
  INNER JOIN roles
  ON employees.role_id = roles.id`
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainLoop();
  });
};

// Shows all Departments
function viewAllDepartments() {
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainLoop();
  });
};

// Displays all current roles
function viewAllRoles() {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainLoop();
  });
};


