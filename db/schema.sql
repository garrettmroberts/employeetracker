DROP DATABASE IF EXISTS employeeTrackerDB;
CREATE DATABASE employeeTrackerDB;
USE employeeTrackerDB;

-- Initialize employees table
CREATE TABLE employees (
  id INT(10) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(10) NOT NULL,
  manager_id INT(10) NULL,
  PRIMARY KEY (id)
);

-- Initialize roles table
CREATE TABLE roles (
  id INT(10) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary INT(10) NOT NULL,
  department_id INT(10) NOT NULL,
  PRIMARY KEY (id)
);

-- Initializes departments table
CREATE TABLE departments (
  id INT(10) AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);