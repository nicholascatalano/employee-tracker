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
    .then((answers) => {
      if (answers.prompt === "View All Employees") {
        db.query(`SELECT * FROM role`, (err, result) => {
          if (err) throw err;
          console.log("Viewing All Employees: ");
          console.table(result);
          employeeTracker();
        });
      }
    });
};
