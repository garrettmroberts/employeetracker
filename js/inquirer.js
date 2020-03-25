const inquirer = require("inquirer");
const q = require("./queries")

function buildDepartment() {
  inquirer.prompt(
    {
      type: "input",
      name: "deptName",
      message: "What is the name of this department?"
    }
  );
};

module.exports = {
  buildDepartment
};
