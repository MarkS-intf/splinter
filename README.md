# Splinter
### A TestRail to Jira Migration Tool

This project allows you to easily migrate test cases from TestRail to Jira as new issues. This tool is written in Node.js and uses the TestRail and Jira REST APIs to fetch and create data respectively.

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

```node index.js <sectionId> <jiraEpicId>```

Replace <sectionId> and <jiraEpicId> with your actual TestRail Section ID and Jira Epic ID.

This will fetch all the test cases under the given TestRail section and create new issues under the given Jira epic.

## ToDo
- Fix formatting when exporting to Jira
- Link test to epic ticket via CLI args
- Update console output to display ALL ticket IDs created after execution of script
- Ticket IDs are being returned numerically (ex. 95353) instead of starting with the prefix "QAB"
- Right now MY credentials are being used in the .env file so I'm going to be watching every ticket created by default.
- Update the script to accept an array or textfile full of IDs instead of just a Testrail folder/"section"
- There should probably be some error handling in terms of checking an epic ticket beforehand to make sure that the test you're about to create, isn't already in there. We definitely don't want a ton of duplicates 

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
