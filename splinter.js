require('dotenv').config()
const {
  formatTestRailResponse,
  formatJiraRequest,
  getTestCasesPerSuite,
  createJiraTicket,
  getSingleTestCase,
  updateTestRailReference
} = require('./utils')

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

    // format the testrail response
    const formattedTest = formatTestRailResponse(singleCaseResponse)

    // Formatting the request for Jira
    const jiraRequestBody = formatJiraRequest(singleCaseResponse.title, jiraEpicId, JSON.stringify(formattedTest))

    // Sending the request
    const newJiraTicketId = await createJiraTicket(jiraRequestBody)

    // Updating the reference in Testrail and linking the created Jira ticket
    await updateTestRailReference(testCaseId, newJiraTicketId)
  } else {
    // Same operations as the above, but in bulk
    const sectionId = firstArg
    const jiraEpicId = secondArg
    const apiResponse = await getTestCasesPerSuite(sectionId)

    for(let i = 0; i < apiResponse.cases.length; i++) {
      const responseData = apiResponse.cases[i]
      const responseTitle = apiResponse.cases[i].title
      const formattedResponse = formatTestRailResponse(responseData)
      const responseDict = { [responseTitle]: formattedResponse }
      formattedTestsForJira.push(responseDict)
    }

    for(let test of formattedTestsForJira) {
      // Getting the title and test data
      const title = Object.keys(test)[0]
      const testRailData = Object.values(test)[0]

      // Extracting the Testrail ID
      const testRailCaseIdMatch = testRailData.match(/Testrail: C(\d+)/)
      const testRailCaseId = testRailCaseIdMatch ? testRailCaseIdMatch[1] : null

      // Formatting the requestfor Jira
      const jiraRequestBody = formatJiraRequest(title, jiraEpicId, JSON.stringify(testRailData))

      // Sending the request
      const newJiraTicketId = await createJiraTicket(jiraRequestBody)

      // Updating the reference in Testrail and linking the created Jira ticket
      await updateTestRailReference(testRailCaseId, newJiraTicketId)
    }
  }
}

main()