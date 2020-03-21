// Import dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");

// Connection is saved as a variable
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "BlueBird36!",
  database: "employeeTrackerDB"
});

// Main loop takes user input from loop 
function mainLoop() {
  inquirer.prompt({
    type: "list",
    name: "userChoice",
    message: "What would you like to do?",
    choices: ["View all employees", "View employees by department", "View employees by manager", "Add an employee", "Remove an employee", "Update employee role", "Update employee manager", "View all roles", "View all departments", "Exit"]
  }).then(({ userChoice }) => {
    if (userChoice === "View all employees") {
      connect(viewAllEmployees);
    } else if (userChoice === "View employees by department") {
      connect(viewEmployeesByDept);
    } else if (userChoice === "View employees by manager") {
      connect(viewEmployeesByManager);
    } else if (userChoice === "Add an employee") {
      connect(addEmployee);
    } else if (userChoice === "Remove an employee") {
      connect(removeEmployee);
    } else if (userChoice === "Update employee role") {
      updateEmployeeRole();
    } else if (userChoice === "Update employee manager") {
      updateEmployeeManager();
    } else if (userChoice === "View all roles") {
      viewAllRoles();
    } else if (userChoice === "View all departments") {
      viewAllDepartments();
    } else if (userChoice === "Exit") {
      return;
    };
  });
};

// Opens a connection to the database, runs callback function fed into it
async function connect(callback) {
  connection.connect(function (err) {
    if (err) throw err;
    callback();
    // connection.end();
  });
};

// Not fully functional.  Need to connect role and manager via id
const viewAllEmployees = function() {
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    res.forEach(({ first_name, last_name, role_id, manager_id }) => {
      console.log(`${first_name} ${last_name}`)
    });
  });
};

const viewEmployeesByDept = function() {

};

const viewEmployeesByManager = function() {

};

// Adds employees, however only accepts roles  and managers by their ids.  Does not accept empty manager field.
const addEmployee = function() {
  inquirer.prompt([{
    type: "text",
    name: "name",
    message: "What is the new employee's name? (first and last)"
  },
  {
    type: "text",
    name: "role",
    message: "What is the new employee's role?"
  },
  {
    type: "text",
    name: "manager",
    message: "What is the new employee's manager? (Leave blank if none)"
  }]).then(({ name, role, manager }) => {
    name = name.split(" ");
    const first_name = name[0];
    const last_name = name[1];
    connection.query(
      "INSERT INTO employees SET ?",
      {
        first_name: first_name,
        last_name: last_name,
        role_id: role,
        manager_id: manager
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " employee inserted!");
        connection.end();
        mainLoop();
      }
    );
  });
};

const removeEmployee = function() {

};

const updateEmployeeRole = function() {

};

const updateEmployeeManager = function() {

};

const viewAllRoles = function() {

};

const viewAllDepartments = function() {

};

mainLoop()