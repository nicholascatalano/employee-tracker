// DEPENDENCIES
const inquirer = require("inquirer");
const db = require("./db/connection.js");

// Starts server after connecting to database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
  employeeTracker();
});

const employeeTracker = function () {
  inquirer
    // initial user prompt
    .prompt([
      {
        type: "list",
        name: "prompt",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit",
        ],
      },
    ])
    .then((answers) => {
      if (answers.prompt === "View All Employees") {
        db.query(`SELECT * FROM employee`, (err, result) => {
          if (err) throw err;
          console.log("Viewing All Employees: ");
          console.table(result);
          employeeTracker();
        });
      }
    });
};
