-- ==============================================================================
-- EXPENSEFLOW: MySQL DATABASE SCHEMA & QUERIES SCRIPT
-- Topics Covered:
-- 5.a. Create a Database and Tables using MySQL Command Line Client
-- 5.b. MySQL Queries to Create Table, Insert Data, Update Data, Delete Data
-- 5.c. MySQL Queries to Implement Subqueries (Scalar, Correlated, IN, Derived Tables)
-- ==============================================================================

-- ==============================================================================
-- 1. DATABASE CREATION (Topic 5.a)
-- ==============================================================================
CREATE DATABASE IF NOT EXISTS expenseflow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE expenseflow_db;

-- Drop tables if they already exist (in reverse order of foreign key dependencies)
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS incomes;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- ==============================================================================
-- 2. TABLE CREATION WITH CONSTRAINTS & RELATIONSHIPS (Topic 5.a & 5.b)
-- ==============================================================================

-- Table 1: Users (Stores system users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    currency VARCHAR(10) DEFAULT 'INR',
    monthly_budget DECIMAL(12, 2) DEFAULT 30000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 2: Categories (Master lookup for expense and income categories)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('expense', 'income') NOT NULL,
    color VARCHAR(20) DEFAULT '#6366f1',
    icon VARCHAR(50) DEFAULT 'Tag',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 3: Expenses (Transaction records for user expenses)
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    payment_method ENUM('UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer') DEFAULT 'UPI',
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 4: Incomes (Transaction records for user earnings)
CREATE TABLE incomes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    source VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) DEFAULT 'Salary',
    payment_method ENUM('UPI', 'Bank Transfer', 'Cash', 'Cheque') DEFAULT 'Bank Transfer',
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create Indexes for performance optimization on frequent queries
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_incomes_date ON incomes(date);

-- ==============================================================================
-- 3. INSERT SAMPLE DATA (Topic 5.b)
-- ==============================================================================

-- Insert Initial User
INSERT INTO users (id, name, email, currency, monthly_budget) VALUES
(1, 'Siva Sankar', 'siva@expenseflow.dev', 'INR', 45000.00);

-- Insert Category Master Data
INSERT INTO categories (name, type, color, icon) VALUES
('Food', 'expense', '#ef4444', 'Utensils'),
('Shopping', 'expense', '#f59e0b', 'ShoppingBag'),
('Transport', 'expense', '#3b82f6', 'Car'),
('Bills', 'expense', '#8b5cf6', 'Receipt'),
('Entertainment', 'expense', '#ec4899', 'Film'),
('Education', 'expense', '#10b981', 'GraduationCap'),
('Health', 'expense', '#14b8a6', 'HeartPulse'),
('Salary', 'income', '#10b981', 'Briefcase'),
('Freelance', 'income', '#6366f1', 'Laptop'),
('Investment', 'income', '#f59e0b', 'TrendingUp');

-- Insert Sample Expenses
INSERT INTO expenses (user_id, title, amount, category, payment_method, date, notes) VALUES
(1, 'Campus Cafeteria Lunch', 180.00, 'Food', 'UPI', '2026-03-10', 'Lunch with project team'),
(1, 'Operating Systems Textbook', 850.00, 'Education', 'Debit Card', '2026-03-12', 'Reference book for sem exam'),
(1, 'Monthly City Bus Pass', 450.00, 'Transport', 'UPI', '2026-03-01', 'Recharge via metro app'),
(1, 'Broadband Internet Bill', 999.00, 'Bills', 'Bank Transfer', '2026-03-05', 'High-speed fiber connection'),
(1, 'Weekend Movie Ticket', 350.00, 'Entertainment', 'Credit Card', '2026-03-15', 'IMAX 3D show'),
(1, 'Grocery & Dairy Supplies', 1420.00, 'Food', 'UPI', '2026-03-18', 'Supermarket monthly essentials'),
(1, 'Cloud Hosting Subscription', 1250.00, 'Bills', 'Credit Card', '2026-03-20', 'AWS/Vercel server deployment'),
(1, 'Gym Monthly Membership', 1500.00, 'Health', 'UPI', '2026-03-02', 'Fitness center pass'),
(1, 'Sneakers & Sportswear', 2899.00, 'Shopping', 'Credit Card', '2026-03-22', 'Sale discount applied'),
(1, 'Mobile Phone Postpaid Bill', 499.00, 'Bills', 'UPI', '2026-03-25', 'Jio Unlimited 5G plan');

-- Insert Sample Incomes
INSERT INTO incomes (user_id, source, amount, category, payment_method, date, notes) VALUES
(1, 'Full-Stack Developer Salary', 55000.00, 'Salary', 'Bank Transfer', '2026-03-01', 'Monthly direct deposit'),
(1, 'Web Dev Client Freelance', 18500.00, 'Freelance', 'Bank Transfer', '2026-03-15', 'React + Express API project'),
(1, 'Mutual Fund Dividend', 3200.00, 'Investment', 'Bank Transfer', '2026-03-20', 'Quarterly payout');

-- ==============================================================================
-- 4. UPDATE DATA QUERIES (Topic 5.b)
-- ==============================================================================

-- Example 1: Update specific expense amount and notes by ID
UPDATE expenses
SET amount = 220.00, notes = 'Lunch with project team + coffee'
WHERE id = 1;

-- Example 2: Update payment method for all bills
UPDATE expenses
SET payment_method = 'UPI'
WHERE category = 'Bills' AND payment_method = 'Bank Transfer';

-- Example 3: Update user monthly budget
UPDATE users
SET monthly_budget = 50000.00
WHERE id = 1;

-- ==============================================================================
-- 5. DELETE DATA QUERIES (Topic 5.b)
-- ==============================================================================

-- Example 1: Delete a specific expense by ID
-- DELETE FROM expenses WHERE id = 10;

-- Example 2: Delete expenses below a minimum threshold
-- DELETE FROM expenses WHERE amount < 50.00;

-- ==============================================================================
-- 6. ADVANCED SUBQUERIES (Topic 5.c)
-- ==============================================================================

-- Subquery 1 (Scalar Subquery in WHERE clause):
-- Find all expenses that are greater than the overall average expense amount
SELECT id, title, amount, category, date
FROM expenses
WHERE amount > (SELECT AVG(amount) FROM expenses)
ORDER BY amount DESC;

-- Subquery 2 (Subquery in FROM clause - Derived Table):
-- Calculate total spent per category and filter categories with spending > 1000
SELECT cat_summary.category, cat_summary.total_spent, cat_summary.transaction_count
FROM (
    SELECT category, SUM(amount) AS total_spent, COUNT(*) AS transaction_count
    FROM expenses
    GROUP BY category
) AS cat_summary
WHERE cat_summary.total_spent > 1000.00
ORDER BY cat_summary.total_spent DESC;

-- Subquery 3 (Subquery with IN operator):
-- Select all categories that have at least one expense recorded against them
SELECT id, name, type, color
FROM categories
WHERE name IN (SELECT DISTINCT category FROM expenses);

-- Subquery 4 (Correlated Subquery):
-- Find the highest expense in each category
SELECT e1.id, e1.title, e1.category, e1.amount, e1.date
FROM expenses e1
WHERE e1.amount = (
    SELECT MAX(e2.amount)
    FROM expenses e2
    WHERE e2.category = e1.category
)
ORDER BY e1.amount DESC;

-- Subquery 5 (Subquery with NOT EXISTS):
-- Find categories that currently have zero expenses recorded
SELECT c.name, c.type
FROM categories c
WHERE NOT EXISTS (
    SELECT 1
    FROM expenses e
    WHERE e.category = c.name
);

-- ==============================================================================
-- End of ExpenseFlow MySQL Schema & Queries
-- ==============================================================================
