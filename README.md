# Playwright Test Automation

This framework include tests for checking UI functionality for the Banking Project.
https://www.globalsqa.com/angularJs-protractor/BankingProject

# Installation steps
- clone repository 
- npm install 
- npx playwright install

# Execution
npx playwright test

# Test cases explanation
- Test passed: Verifies adding a customer 
- Test passed: Verify customer added appear in the Customers list 
- Test failed: Verify customer added appear in the Customers list after closing and reopen the browser 
- Test passed: Verify deposit work as expected: login with an existing user and check that the deposit is making successfuly 

# Project structure
- Page Object Model: Two main POMs - ManagerView (handles manager actions like adding customers, check deposit amount) and Helper (contains utility functions like generating random user data)

- fixtures.ts: Used to set up global configurations and data across tests

- tests: folder for defining the spec files with tests to verify application functionality
