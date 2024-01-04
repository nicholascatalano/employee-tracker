-- Inserts names of departments into created department table
INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance'),
    ('Legal');

-- Inserts role information into created role table
INSERT INTO role (title, salary, department_id)
VALUES
    ('Mechanical Engineer', 90000, 1),
    ('Sales Leader', 110000, 2),
    ('Financial Analyst', 80000, 3),
    ('Lawyer', 125000, 4);

-- Inserts employee information into created employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Barbara', 'Chaney', 1, 3),
    ('Charles', 'Petersen', 2, 1),
    ('Levi', 'Luna', 3, 4),
    ('Roosevelt', 'Mcconnell', 4, 2);