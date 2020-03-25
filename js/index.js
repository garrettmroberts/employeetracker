// Import dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const util = require("util");

// Main loop takes user input from loop 
function mainLoop() {
  inquirer.prompt({
    type: "list",
    name: "userChoice",
    message: "What would you like to do?",
    choices: ["View all employees", "View departments", "View roles", "Add a department", "Add a role", "Add an employee", "Update Employee Role", "Exit"]
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
      case "Add a role":
        addRole();
        break;
      case "Add an employee":
        collectAddEmployeeInfo();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      default:
        connection.end();
    };
  });
};

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

// Generates manager array from database + a (none)
async function generateManagerArray() {
  const result = await queryAsync("SELECT first_name, last_name FROM employees");
  var resultArray = result.map(employee => `${employee.first_name} ${employee.last_name}`);
  resultArray.push("(none)");
  return resultArray;
};

// Generates employee array from database
async function generateEmployeeArray() {
  const result = await queryAsync("SELECT first_name, last_name FROM employees");
  var resultArray = result.map(employee => `${employee.first_name} ${employee.last_name}`);
  return resultArray;
}

// Generates all roles available in a database
async function generateRolesArray() {
  const result = await queryAsync("SELECT title FROM roles");
  return result.map(role => role.title)
};

// Helper function gets employee ID by first and last name params
async function getEmployeeIDByName(first_name, last_name) {
  const result = await queryAsync(`SELECT id FROM employees WHERE first_name="${first_name}" && last_name="${last_name}"`);
  return result[0].id
};

// Helper function gets job id by title param
async function getRoleIDByTitle(title) {
  const result = await queryAsync(`SELECT id FROM roles WHERE title="${title}"`);
  return result[0].id;
}

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

function addDepartment() {
  inquirer.prompt(
    {
      type: "input",
      name: "deptName",
      message: "What is the name of this department?"
    }).then(({ deptName }) => {
      const sql = `INSERT INTO departments (name) VALUES ("${deptName}");`
      connection.query(sql, (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} department added.`);
        mainLoop();
      });
    });
};

// Adds a new role to role table
async function addRole() {
  var depts = await generateDepartmentArray();
  await inquirer.prompt([
    {
      type: "input",
      message: "What is the title of this role?",
      name: "title"
    },
    {
      type: "number",
      message: "What salary does this role need?",
      name: "salary"
    },
    {
      type: "list",
      message: "At which department does this role operate?",
      name: "department",
      choices: depts
    }
  ]).then(({ title, salary, department }) => {
    connection.query(`SELECT id FROM departments WHERE departments.name="${department}"`, (err, res) => {
      if (err) throw err;
      const deptId = res[0].id;
    connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${title}", ${salary}, ${deptId})`, (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} department added.`);
        mainLoop();
      });
    });
  });
};

// Adds a new employee, either with or without a manager
async function collectAddEmployeeInfo() {
  var roles = await generateRolesArray();
  var managers = await generateManagerArray();
  await inquirer.prompt([
    {
      type: "text",
      message: "What is the employee's first name?",
      name: "first_name"
    },
    {
      type: "text",
      message: "What is the employee's first name?",
      name: "last_name"
    },
    {
      type: "list",
      choices: roles,
      message: "What is the employee's role?",
      name: "role"
    },
    {
      type: "list",
      choices: managers,
      message: "Who is this employee's manager?",
      name: "manager"
    }
  ]).then(async ({ first_name, last_name, role, manager }) => {
    if (manager != "(none)") {
      connection.query("SELECT id FROM roles WHERE title = ?", [role], (err, res) => {
        if (err) throw err;
        var role_id = res[0].id;
        addEmployeeWithManager(first_name, last_name, role_id, manager);
      });
    } else {
      addEmployeeWithoutManager(first_name, last_name, role);
    };
  });
};

function addEmployeeWithManager(first_name, last_name, role_id, manager) {
  var managerFirstName = manager.split(" ")[0];
  var managerLastName = manager.split(" ")[1];
  connection.query("SELECT id FROM employees WHERE first_name=? AND last_name=?", [managerFirstName, managerLastName], (err, res) => {
    if (err) throw err;
    var manager_id = res[0].id;
    queryAsync(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${first_name}", "${last_name}", "${role_id}", "${manager_id}")`);
    mainLoop();
  })
};

function addEmployeeWithoutManager(first_name, last_name, role) {
  connection.query("SELECT id FROM roles WHERE title = ?", [role], (err, res) => {
    if (err) throw err;
    var role_id = res[0].id;
    queryAsync(`INSERT INTO employees (first_name, last_name, role_id) VALUES ("${first_name}", "${last_name}", "${role_id}")`);
    mainLoop();
  });
};

async function updateEmployeeRole() {
  var employeeList = await generateEmployeeArray()
  inquirer.prompt({
    type: "list",
    name: "employee",
    message: "Choose an employee",
    choices: employeeList
  }).then(async ({ employee }) => {
    var first_name = employee.split(" ")[0];
    var last_name = employee.split(" ")[1];
    var employee_id = await getEmployeeIDByName(first_name, last_name);
    var rolesList = await generateRolesArray();
    inquirer.prompt({
      type: "list",
      name: "role",
      message: "What is the new role?",
      choices: rolesList
    }).then(async ({ role }) => {
      var role_id = await getRoleIDByTitle(role)
      queryAsync(`UPDATE employees SET role_id="${role_id}" WHERE id="${employee_id}"`);
      mainLoop();
    })
  });
};

mainLoop();
