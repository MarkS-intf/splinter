### Splinter
## A TestRail to Jira Migration Tool

This project allows you to easily migrate test cases from TestRail to Jira as new issues. This tool is written in Node.js and uses the TestRail and Jira REST APIs to fetch and create data respectively.

## Prerequisites

    Node.js
    NPM (Node Package Manager)

## Environment Variables

Create a .env file in the root directory and populate the following variables:

```TESTRAIL_USERNAME=<Your TestRail Username>```
```TESTRAIL_PASSWORD=<Your TestRail Password or API Key>```
```JIRA_USERNAME=<Your Jira Email>```
```JIRA_API_KEY=<Your Jira API Key>```

## Installation

Clone the repository: git clone https://github.com/YourUsername/TestRailToJira.git
Navigate to the project directory: ```cd TestRailToJira```
Install the dependencies: npm install

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