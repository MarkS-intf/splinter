require('dotenv').config()
const {
  formatTestRailResponse,
  formatJiraRequest,
  getTestCasesPerSuite,
  createJiraTicket,
  getSingleTestCase,
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

    const singleCaseResponse = await getSingleTestCase(testCaseId)
    const formattedTest = formatTestRailResponse(singleCaseResponse)
    const jiraRequestBody = formatJiraRequest(singleCaseResponse.title, jiraEpicId, JSON.stringify(formattedTest))
    await createJiraTicket(jiraRequestBody)
  } else {
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
      const title = Object.keys(test)[0]
      const testRailData = Object.values(test)[0]
      const jiraRequestBody = formatJiraRequest(title, jiraEpicId, JSON.stringify(testRailData))
      await createJiraTicket(jiraRequestBody)
    }
  }
}

main()