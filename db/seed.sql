USE employeeTrackerDB;

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("John", "Mcafee", 4),
("Hacker", "Man", 7),
("Emily", "Roberts", 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Heath", "Ledger", 5, 1),
("Howard", "Taft", 5, 1),
("Elvis", "Presley", 6, 2),
("Catherine", "Wilberforce", 5 , 2),
("Omar", "Vashti", 1, 3),
("Neil", "Diamond", 2, 3);

INSERT INTO roles (title, salary, department_id)
VALUES ("Marketing Designer", 45000, 1),
("Social Media Marketer", 47000, 1),
("Brand Image Coordinator", 50000, 1),
("Senior Developer", 100000, 2),
("Junior Developer", 60000, 2),
("QA analyst", 65000, 2),
("DevOps dude", 110000, 2);

INSERT INTO departments (name)
VALUES ("Marketing"),
("Software Development");