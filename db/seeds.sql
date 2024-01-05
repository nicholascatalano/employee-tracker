-- Inserts names of departments into created departments table
INSERT INTO departments (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance'),
    ('Legal');

-- Inserts role information into created roles table
INSERT INTO roles (title, salary, department_id)
VALUES
    ('Mechanical Engineer', 90000, 1),
    ('Sales Leader', 110000, 2),
    ('Financial Analyst', 80000, 3),
    ('Lawyer', 125000, 4);

-- Inserts employee information into created employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Barbara', 'Chaney', 1, 3),
    ('Charles', 'Petersen', 2, 1),
    ('Levi', 'Luna', 3, 4),
    ('Roosevelt', 'Mcconnell', 4, 2);