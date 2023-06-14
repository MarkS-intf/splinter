require('dotenv').config()
const {
  formatJiraRequest,
  getTestCasesPerSuite,
  createJiraTicket,
  getSingleTestCase,
  updateTestRailReference
} = require('./utils')
const fs = require('fs')
const path = require('path')

let formattedTestsForJira = []

async function main() {
  // Error handling
  if(process.argv.length < 3) {
    console.error('Missing arguments. Usage: node index.js -s <testCaseId> <jiraEpicId> OR node index.js <sectionId> <jiraEpicId>')
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }

  // Setting vars to inputs
  const firstArg = process.argv[2]
  const secondArg = process.argv[3]
  const thirdArg = process.argv[4]

  // COMMAND: Create a single case
  if(firstArg === '-s') {
    if(!thirdArg) {
      console.error('Missing jiraEpicId for single test case. Usage: node index.js -s <testCaseId> <jiraEpicId>')
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    }
    const testCaseId = secondArg
    const jiraEpicId = thirdArg

    // Get the specified test case from Testrail
    const singleCaseResponse = await getSingleTestCase(testCaseId)

    // Formatting the request for Jira
    const jiraRequestBody = formatJiraRequest(singleCaseResponse.title, jiraEpicId, singleCaseResponse)

    // Sending the request
    const newJiraTicketId = await createJiraTicket(jiraRequestBody)

    // Updating the reference in Testrail and linking the created Jira ticket
    await updateTestRailReference(testCaseId, newJiraTicketId)
  }
  // COMMAND: Bulk Create Jira tickets based on a Testrail folder
  else if(firstArg === '-f') {
    if(!thirdArg) {
      console.error('Missing jiraEpicId for test cases from a TestRail folder. Usage: node index.js -f <sectionId> <jiraEpicId>')
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    }

    // Same operations as the above, but in bulk
    const sectionId = secondArg
    const jiraEpicId = thirdArg
    const apiResponse = await getTestCasesPerSuite(sectionId)

    for(let i = 0; i < apiResponse.cases.length; i++) {
      formattedTestsForJira.push(apiResponse.cases[i])
    }

    for(let test of formattedTestsForJira) {
      // Formatting the request for Jira
      const jiraRequestBody = formatJiraRequest(test.title, jiraEpicId, test)

      // Sending the request
      const newJiraTicketId = await createJiraTicket(jiraRequestBody)

      // Updating the reference in Testrail and linking the created Jira ticket
      await updateTestRailReference(test.id, newJiraTicketId)
    }
  }
  // COMMAND: Bulk Create Jira tickets with specified test cases via txt file
  else if(firstArg === '-b') {
    if(!secondArg) {
      console.error('Missing jiraEpicId for batch of test cases. Usage: node index.js -b <jiraEpicId>')
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    }

    const filePath = path.join(__dirname, 'testrail-caseids.txt')
    const jiraEpicId = secondArg

    if(!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8')
      console.error('File \'testrail-caseids.txt\' not found. An empty one has been created. Please fill it out with TestRail case IDs and run the command again.')
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    }

    const testCaseIds = fs.readFileSync(filePath, 'utf8').split('\n')

    for(const testCaseId of testCaseIds) {
      const testCaseData = await getSingleTestCase(testCaseId)
      const jiraRequestBody = formatJiraRequest(testCaseData.title, jiraEpicId, testCaseData)
      const newJiraTicketId = await createJiraTicket(jiraRequestBody)
      await updateTestRailReference(testCaseId, newJiraTicketId)
    }
  }
  else {
    console.error('No command specified!')
  }
}

main()