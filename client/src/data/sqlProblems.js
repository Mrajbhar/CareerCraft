
export const sqlProblems = [
  {
    id: "recyclable-low-fat",
    title: "Recyclable and Low Fat Products",
    difficulty: "Easy",
    topic: "Filtering",
    prompt: "Table Products(product_id, low_fats, recyclable). Find the product_id of products that are both low fat ('Y') and recyclable ('Y').",
    schema: `CREATE TABLE Products(product_id INTEGER, low_fats TEXT, recyclable TEXT);
INSERT INTO Products VALUES (0,'Y','N'),(1,'Y','Y'),(2,'N','Y'),(3,'Y','Y'),(4,'N','N');`,
    expected: [[1], [3]],
  },
  {
    id: "customer-referee",
    title: "Find Customer Referee",
    difficulty: "Easy",
    topic: "NULL handling",
    prompt: "Table Customer(id, name, referee_id). Return the name of every customer NOT referred by the customer with id = 2. (Customers with no referrer count.)",
    schema: `CREATE TABLE Customer(id INTEGER, name TEXT, referee_id INTEGER);
INSERT INTO Customer VALUES (1,'Will',NULL),(2,'Jane',NULL),(3,'Alex',2),(4,'Bill',NULL),(5,'Zack',1),(6,'Mark',2);`,
    expected: [["Will"], ["Jane"], ["Bill"], ["Zack"]],
  },
  {
    id: "big-countries",
    title: "Big Countries",
    difficulty: "Easy",
    topic: "Filtering",
    prompt: "Table World(name, continent, area, population, gdp). A country is big if area >= 3000000 OR population >= 25000000. Return name, population, area of big countries.",
    schema: `CREATE TABLE World(name TEXT, continent TEXT, area INTEGER, population INTEGER, gdp INTEGER);
INSERT INTO World VALUES
('Afghanistan','Asia',652230,25500100,20343000),
('Albania','Europe',28748,2831741,12960000),
('Algeria','Africa',2381741,37100000,188681000),
('Andorra','Europe',468,78115,3712000),
('Angola','Africa',1246700,20609294,100990000);`,
    expected: [["Afghanistan", 25500100, 652230], ["Algeria", 37100000, 2381741]],
  },
  {
    id: "duplicate-emails",
    title: "Duplicate Emails",
    difficulty: "Easy",
    topic: "Group By",
    prompt: "Table Person(id, email). Report all email addresses that appear more than once.",
    schema: `CREATE TABLE Person(id INTEGER, email TEXT);
INSERT INTO Person VALUES (1,'a@b.com'),(2,'c@d.com'),(3,'a@b.com');`,
    expected: [["a@b.com"]],
  },
  {
    id: "customers-never-order",
    title: "Customers Who Never Order",
    difficulty: "Easy",
    topic: "Joins / Subquery",
    prompt: "Tables Customers(id, name) and Orders(id, customerId). Return the names of customers who never placed an order.",
    schema: `CREATE TABLE Customers(id INTEGER, name TEXT);
CREATE TABLE Orders(id INTEGER, customerId INTEGER);
INSERT INTO Customers VALUES (1,'Joe'),(2,'Henry'),(3,'Sam'),(4,'Max');
INSERT INTO Orders VALUES (1,3),(2,1);`,
    expected: [["Henry"], ["Max"]],
  },
  {
    id: "earn-more-than-manager",
    title: "Employees Earning More Than Their Managers",
    difficulty: "Easy",
    topic: "Self Join",
    prompt: "Table Employee(id, name, salary, managerId). Return the names of employees who earn more than their manager.",
    schema: `CREATE TABLE Employee(id INTEGER, name TEXT, salary INTEGER, managerId INTEGER);
INSERT INTO Employee VALUES (1,'Joe',70000,3),(2,'Henry',80000,4),(3,'Sam',60000,NULL),(4,'Max',90000,NULL);`,
    expected: [["Joe"]],
  },
  {
    id: "combine-two-tables",
    title: "Combine Two Tables",
    difficulty: "Easy",
    topic: "Left Join",
    prompt: "Tables Person(personId, lastName, firstName) and Address(addressId, personId, city, state). For each person return firstName, lastName, city, state (city/state are NULL if there is no address).",
    schema: `CREATE TABLE Person(personId INTEGER, lastName TEXT, firstName TEXT);
CREATE TABLE Address(addressId INTEGER, personId INTEGER, city TEXT, state TEXT);
INSERT INTO Person VALUES (1,'Wang','Allen'),(2,'Alice','Bob');
INSERT INTO Address VALUES (1,2,'New York City','New York'),(2,3,'Leetcode','California');`,
    expected: [["Allen", "Wang", null, null], ["Bob", "Alice", "New York City", "New York"]],
  },
  {
    id: "employee-bonus",
    title: "Employee Bonus",
    difficulty: "Easy",
    topic: "Left Join",
    prompt: "Tables Employee(empId, name, supervisor, salary) and Bonus(empId, bonus). Return name and bonus of employees whose bonus is less than 1000, or who have no bonus (NULL).",
    schema: `CREATE TABLE Employee(empId INTEGER, name TEXT, supervisor INTEGER, salary INTEGER);
CREATE TABLE Bonus(empId INTEGER, bonus INTEGER);
INSERT INTO Employee VALUES (3,'Brad',NULL,4000),(1,'John',3,1000),(2,'Dan',3,2000),(4,'Thomas',3,4000);
INSERT INTO Bonus VALUES (2,500),(4,2000);`,
    expected: [["Brad", null], ["John", null], ["Dan", 500]],
  },
  {
    id: "second-highest-salary",
    title: "Second Highest Salary",
    difficulty: "Medium",
    topic: "Subquery",
    prompt: "Table Employee(id, salary). Return the second highest distinct salary (a single value). If it doesn't exist, return NULL.",
    schema: `CREATE TABLE Employee(id INTEGER, salary INTEGER);
INSERT INTO Employee VALUES (1,100),(2,200),(3,300);`,
    expected: [[200]],
  },
  {
    id: "department-highest-salary",
    title: "Department Highest Salary",
    difficulty: "Medium",
    topic: "Join + Group By",
    prompt: "Tables Employee(id, name, salary, departmentId) and Department(id, name). Return the department name, employee name, and salary for the highest-paid employee(s) in each department. Columns: Department, Employee, Salary.",
    schema: `CREATE TABLE Employee(id INTEGER, name TEXT, salary INTEGER, departmentId INTEGER);
CREATE TABLE Department(id INTEGER, name TEXT);
INSERT INTO Employee VALUES (1,'Joe',70000,1),(2,'Jim',90000,1),(3,'Henry',80000,2),(4,'Sam',60000,2),(5,'Max',90000,1);
INSERT INTO Department VALUES (1,'IT'),(2,'Sales');`,
    expected: [["IT", "Jim", 90000], ["IT", "Max", 90000], ["Sales", "Henry", 80000]],
  },
  {
    id: "rank-scores",
    title: "Rank Scores",
    difficulty: "Medium",
    topic: "Window Function",
    prompt: "Table Scores(id, score). Return each score and its rank, highest first. Equal scores get the same rank, and ranks have no gaps (dense rank). Columns: score, rank. Order by score descending.",
    schema: `CREATE TABLE Scores(id INTEGER, score REAL);
INSERT INTO Scores VALUES (1,3.50),(2,3.65),(3,4.00),(4,3.85),(5,4.00),(6,3.65);`,
    ordered: true,
    expected: [[4.0, 1], [4.0, 1], [3.85, 2], [3.65, 3], [3.65, 3], [3.5, 4]],
  },
];