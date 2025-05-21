# Automated E2E Testing for ParaBank using Playwright

This project contains automated end-to-end (E2E) tests for the ParaBank demo application using Playwright.

## Prerequisites

- Node.js (v14 or higher)
- NPM (Node Package Manager)
- Docker (optional, for containerized execution)

## Installation and Setup

### Option 1: Docker Setup

Run the tests in a Docker container for simplified setup:

1. Clone this repository:
```bash
git clone <repository-url>
cd ParaBank
```

2. Build the Docker image:
```bash
docker build -t parabank-tests .
```

### Option 2: Standard Setup

If you prefer to run the tests directly on your machine:

1. Clone this repository:
```bash
git clone <repository-url>
cd ParaBank
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

> Note: While `npm install` will install the Playwright framework, the last command is required to download the browser binaries that Playwright needs to run the tests.

## Running Tests

### Docker Execution

Run tests in the Docker container:

```bash
# Run tests in the container
docker run parabank-tests

# Extract the report from the container to your local machine
docker cp $(docker ps -a -q | head -1):/app/playwright-report ./

# Then show the HTML report
npx playwright show-report
```

### Standard Execution

Run the tests on your local machine using one of the following commands:

```bash
# Run all tests
npx playwright test

# Run tests with HTML report (report will open automatically)
npx playwright test --reporter=html

# Run a specific test file
npx playwright test tests/authentication.spec.ts
```

> Note: Failing tests will generate a trace with detailed information and screenshots in the report generated.

## Project Structure

```
├── constants/                         # Test constants and data
│   ├── bill-payment.ts                 
│   └── users.ts                      
├── fixtures/                          # Playwright test fixtures
│   ├── account-fixtures.ts               
│   ├── login-fixtures.ts       
│   └── register-fixtures.ts           
├── helpers/                           # Helper functions
│   └── db-helper.ts                   
├── pages/                             # Page Object Models
│   ├── activity-page.ts              
│   ├── base-page.ts                   
│   ├── bill-pay-page.ts                
│   ├── find-transactions-page.ts       
│   ├── index-page.ts                  
│   ├── open-account-page.ts            
│   ├── overview-page.ts               
│   ├── register-page.ts               
│   ├── request-loan-page.ts            
│   ├── transfer-page.ts               
│   └── update-profile-page.ts         
├── tests/                             # Test files
│   ├── authentication.spec.ts        
│   ├── bill-payment.spec.ts            
│   ├── open-account.spec.ts         
│   ├── register.spec.ts             
│   ├── request-loan.spec.ts            
│   ├── transfer-funds.spec.ts          
│   └── update-profile.spec.ts         
├── Dockerfile                         # Docker configuration
├── playwright.config.ts               # Playwright configuration
└── package.json                       # Project dependencies
```

## Configuration

The project uses the Playwright configuration file (`playwright.config.ts`) to set up the test environment:

- Base URL is set to [`https://parabank.parasoft.com`](https://parabank.parasoft.com)
- HTML reporter is configured to open automatically
- Trace is collected on test failure for debugging

## Additional Resources

- [ParaBank Demo Application](https://parabank.parasoft.com)
- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
