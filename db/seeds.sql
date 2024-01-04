-- Inserts names of departments into created department table
INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Mechanical Engineer', 90000, 1),
    ('Sales Leader', 110000, 2),
    ('Financial Analyst', 80000, 3),
    ('Lawyer', 125000, 4);

