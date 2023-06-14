# Splinter
### A TestRail to Jira Migration Tool

This project allows you to easily migrate test cases from TestRail to Jira as new issues (what we know as tickets). It will copy and paste singular or bulk testrail tests. By default it takes a testrail folder ID. It also updates testrail references to help ensure a 1:1 relationship between Jira and Testrail. This tool is written in Node.js and uses the TestRail and Jira REST APIs to fetch, create, and update data respectively.

## Prerequisites

    Node.js
    NPM (Node Package Manager)

## Dependencies Used
- axios: This is a popular, promise-based HTTP client for making asynchronous HTTP requests to REST endpoints. It supports several features like interceptors, transforms, and automatic transforms for JSON data. It's being used in your project to make HTTP requests to TestRail and Jira APIs.

- dotenv: This is a module that loads environment variables from a .env file into process.env. It provides an easy way to allow your project to have configuration-specific variables. In your project, it's likely being used to manage sensitive data such as API keys and URLs.

- @babel/eslint-parser: This is a parser that allows ESLint to lint all valid Babel code. ESLint is a tool for identifying and reporting on patterns in JavaScript, and Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backward-compatible version of JavaScript. The parser is used here to ensure that ESLint can correctly interpret and lint your code.

- eslint: This is a highly configurable and flexible tool that is used to identify and report on patterns in JavaScript. It helps to maintain code quality and ensure coding conventions are followed.

- eslint-plugin-filenames: This is an ESLint plugin that enforces naming conventions for your files based on the configurations specified. It helps to maintain consistent filenames throughout the project.

- eslint-plugin-node: This is an ESLint plugin that provides a set of linting rules specific to Node.js. It helps to prevent common errors in Node.js code and ensure good practices are followed.

## Environment Variables

Create a .env file in the root directory and populate the following variables:

```
TESTRAIL_USERNAME='<your_testrail_username>'
TESTRAIL_PASSWORD='<your_testrail_password>'
TESTRAIL_API_KEY='<your_testrail_api_key>'
JIRA_USERNAME='<your_jira_username>'
JIRA_PASSWORD='<your_jira_password>'
JIRA_API_KEY='<your_jira_api_key>'
```

## Installation

Clone the repository: git clone https://github.com/YourUsername/TestRailToJira.git
Navigate to the project directory: ```cd TestRailToJira```
Install the dependencies: ```npm install```

## Usage

Run the script by passing in the TestRail Section ID and the Jira Epic ID:

```node splinter.js -f <testrail-sectionId> <jiraEpicId>```

Replace <testrail-sectionId> and <jiraEpicId> with your actual TestRail Section ID and Jira Epic ID.

This will fetch all the test cases under the given TestRail section (folder) and create new issues under the given Jira epic.

Additionally, you can provide a single testrail case ID (without the C-prefix):

```node splinter.js -s <testCaseID> <jiraEpicId>```

Or if you have a bunch of singular tickets that don't live under the same folder in Jira, you can fill out the "testrail-caseids.txt" file and then use the -b (bulk) command

```node splinter.js -b <jiraEpicId>```

## Usage Cont.
The -s flag is used for creating a single jira ticket. It requires both a test case ID and a JIRA epic ID as arguments. The code retrieves a test case from TestRail using the provided ID, creates a new JIRA ticket with the retrieved test case data, and updates the TestRail reference with the newly created JIRA ticket ID.

The -f flag is used for creating multiple Jira tickets based on a TestRail folder (or the group ID). It requires both a TestRail folder ID and a JIRA epic ID as arguments. The code retrieves all test cases from the TestRail folder using the provided folder ID, creates new JIRA tickets for each test case, and updates the TestRail references with the corresponding new JIRA ticket IDs.

The -b flag is used for creating JIRA tickets in bulk from a text file containing TestRail case IDs. It requires a JIRA epic ID as an argument. The code reads test case IDs from a predefined text file (testrail-caseids.txt), retrieves each test case from TestRail using the provided IDs, creates new JIRA tickets for each test case, and updates the TestRail references with the corresponding new JIRA ticket IDs. If the text file doesn't exist, the code creates it and exits the program, prompting the user to fill it out and run the command again.

## ToDo
- Link test to epic ticket via CLI args
- Right now MY credentials are being used in the .env file so I'm going to be watching every ticket created by default.
- There should probably be some error handling in terms of checking an epic ticket beforehand to make sure that the test you're about to create, isn't already in there. We definitely don't want a ton of duplicates 

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.