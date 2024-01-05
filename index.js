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

// function to view all employees in database
function viewEmployees() {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name,' ',manager.last_name) AS Manager
    FROM employees 
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    // restart the application
    employeeTracker();
  });
}

// function to add a department to the database
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "What is the name of your department:",
    })
    .then((answer) => {
      const sql = `INSERT INTO departments (name) VALUES ("${answer.name}")`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`Added department ${answer.name} to the database!`);
        // restart the application
        employeeTracker();
      });
    });
}

function addRole() {
  let departmentArray = [];
  db.query(`SELECT * FROM departments`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      departmentArray.push(results[i].name);
    }
    return inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the new role?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary of the new role?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department is the role under?",
          name: "department",
          choices: departmentArray,
        },
      ])
      .then((data) => {
        // Get's department id
        db.query(
          `SELECT id FROM departments WHERE departments.name = ?`,
          data.department,
          (err, results) => {
            let department_id = results[0].id;
            db.query(
              `INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)`,
              [data.title, data.salary, department_id],
              (err, results) => {
                console.log("\nNew role added!");
                viewRoles();
              }
            );
          }
        );
      });
  });
}

// function to add an employee
function addEmployee() {
  const rolesArray = [];
  const employeesArray = [];

  // populates roles into rolesArray
  db.query(`SELECT * FROM roles`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      rolesArray.push(results[i].title);
    }
    // populates employees into employeesArray
    db.query(`SELECT * FROM employees`, function (err, results) {
      for (let i = 0; i < results.length; i++) {
        let employeeName = `${results[i].first_name} ${results[i].last_name}`;
        employeesArray.push(employeeName);
      }
      return inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employee's first name?",
            name: "first_name",
          },
          {
            type: "input",
            message: "What is the employee's last name?",
            name: "last_name",
          },
          {
            type: "list",
            message: "What is the employee's role?",
            name: "role",
            choices: rolesArray,
          },
          {
            type: "list",
            message: "Does the employee have a manager?",
            name: "has_manager",
            choices: ["Yes", "No"],
          },
        ])
        .then((data) => {
          let roleTitle = data.role;
          let first_name = data.first_name;
          let last_name = data.last_name;
          let role_id = "";
          let hasManager = "";
          // populates role id
          db.query(
            `SELECT id FROM roles WHERE roles.title = ?`,
            data.role,
            (err, results) => {
              role_id = results[0].id;
            }
          );
          if (data.has_manager === "Yes") {
            return inquirer
              .prompt([
                {
                  type: "list",
                  message: "Please select the employees' manager.",
                  name: "manager",
                  choices: employeesArray,
                },
              ])
              .then((data) => {
                // get role id
                db.query(
                  `SELECT id FROM roles WHERE roles.title = ?`,
                  roleTitle,
                  (err, results) => {
                    role_id = results[0].id;
                  }
                );
                db.query(
                  `SELECT id FROM employees WHERE employees.first_name = ? AND employees.last_name = ?;`,
                  data.manager.split(" "),
                  (err, results) => {
                    hasManager = results[0].id;
                    db.query(
                      `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                          VALUES (?,?,?,?)`,
                      [first_name, last_name, role_id, hasManager],
                      (err, results) => {
                        console.log("\nNew employee added.");
                        viewEmployees();
                      }
                    );
                  }
                );
              });
          } else {
            // sets manager to null
            manager = null;
            // get role id
            db.query(
              `SELECT id FROM roles WHERE roles.title = ?`,
              roleTitle,
              (err, results) => {
                role_id = results[0].id;

                db.query(
                  `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                      VALUES (?,?,?,?)`,
                  [data.first_name, data.last_name, role_id, manager],
                  (err, results) => {
                    console.log("\nNew employee added. See below:");
                    viewEmployees();
                  }
                );
              }
            );
          }
        });
    });
  });
}

// function to update employee record
function updateEmployeeRole() {
  const rolesArray = [];
  const employeesArray = [];

  // populates roles into rolesArray
  db.query(`SELECT * FROM roles`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      rolesArray.push(results[i].title);
    }
    // populates employees into employeesArray
    db.query(`SELECT * FROM employees`, function (err, results) {
      for (let i = 0; i < results.length; i++) {
        let employeeName = `${results[i].first_name} ${results[i].last_name}`;
        employeesArray.push(employeeName);
      }
      return inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee do you want to update?",
            name: "employee",
            choices: employeesArray,
          },
          {
            type: "list",
            message: "What is the employee's new role?",
            name: "role",
            choices: rolesArray,
          },
        ])
        .then((data) => {
          // get role id
          db.query(
            `SELECT id FROM roles WHERE roles.title = ?;`,
            data.role,
            (err, results) => {
              role_id = results[0].id;
              db.query(
                `SELECT id FROM employees WHERE employees.first_name = ? AND employees.last_name = ?;`,
                data.employee.split(" "),
                (err, results) => {
                  db.query(
                    `UPDATE employees SET role_id = ? WHERE id = ?;`,
                    [role_id, results[0].id],
                    (err, results) => {
                      console.log("\nEmployee role updated.");
                      viewEmployees();
                    }
                  );
                }
              );
            }
          );
        });
    });
  });
}
