// DEPENDENCIES
const inquirer = require("inquirer");
const db = require("./db/connection");

// Starts server after connecting to database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
  employeeTracker();
});

let employeeTracker = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "prompt",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Updated Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((answers) => {});
};
