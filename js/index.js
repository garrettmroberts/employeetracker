// Import dependencies
const inquirer = require("inquirer");
const q = require("./queries")

mainLoop();
// Main loop takes user input from loop 
function mainLoop() {
  inquirer.prompt({
    type: "list",
    name: "userChoice",
    message: "What would you like to do?",
    choices: ["View all employees", "View departments", "View roles", "Add a department", "Add a role", "Add an employee", "View employees by manager", "Add an employee", "Remove an employee", "Update employee role", "Update employee manager", "View all roles", "View all departments", "Exit"]
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
      default:
        connection.end();
    };
  });
};
// Shows employee list w/ full names and job title
function viewAllEmployees() {
  const query = `SELECT employees.first_name, employees.last_name, roles.title
  FROM employees
  INNER JOIN roles
  ON employees.role_id = roles.id`
  q.connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainLoop();
  });
};

// Shows all Departments
function viewAllDepartments() {
  q.connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainLoop();
  });
};

// Displays all current roles
function viewAllRoles() {
  q.connection.query("SELECT * FROM roles", (err, res) => {
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
  var depts = await q.generateDepartmentArray();
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

// Needs a bit of work.  Scoping issues.
async function collectAddEmployeeInfo() {
  var roles = await generateRolesArray();
  var managers = await generateEmployeeArray();
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
  ]).then(({ first_name, last_name, role, manager }) => {
    
    queryAsync(`SELECT id FROM roles WHERE title="${role}"`, (err, res) => {
      if (err) throw err;
      role_id = res[0].id;
    });
    if (manager != "(none)") {
      var managerFirstName = manager.split(" ")[0];
      var managerLastName = manager.split(" ")[1];
      queryAsync(`SELECT id FROM employees WHERE first_name="${managerFirstName}" && last_name="${managerLastName}"`, (err, res) => {
        if (err) throw err;
        manager_id = res[0].id;
      });
      addEmployeeWithManager(first_name, last_name, role_id, manager_id);
    } else {
      addEmployeeWithoutManager();
    }
  });
};

function addEmployeeWithManager(first_name, last_name, role_id, manager_id) {
  queryAsync("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (first_name, last_name, role_id, manager_id);");
  console.log(`${connection.affectedRows} employee added.`);
  mainLoop();
};

function addEmployeeWithoutManager() {
  console.log("New w/o manager")
};


