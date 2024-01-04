// DEPENDENCIES
const inquirer = require("inquirer");
const db = require("./db/connection");

// Starts server after connecting to database
db.connect(err => {
    if (err) throw err;
    console.log("Connected to database!");
    employeeTracker();
})

let employeeTracker = function () {
    inquirer.prompt([{
        
    }])
}