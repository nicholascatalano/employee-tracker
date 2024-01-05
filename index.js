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
    .then((answer) => {
      switch (answer.prompt) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          break;
        case "Quit":
          db.end();
          console.log("Thank you!");
          break;
      }
    });
};

// function to view all departments
function viewDepartments() {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    // restart the application
    employeeTracker();
  });
}

// function to view roles in database
function viewRoles() {
  const sql =
    "SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    // restart the application
    employeeTracker();
  });
}

function viewEmployees() {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, employees.manager_id AS managerID
  FROM employees JOIN roles ON employees.role_id = employees.id`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    // restart the application
    employeeTracker();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "What is the name of your department:",
    })
    .then((answer) => {
      console.log(answer.name);
      const sql = `INSERT INTO departments (name) VALUES ("${answer.name}")`;
      db.query(sql, (err, res) => {
        if (err) throw err;
        console.log(`Added department ${answer.name} to the database!`);
        // restart the application
        employeeTracker();
      });
    });
}
