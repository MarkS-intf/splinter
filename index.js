require('dotenv').config()
const { 
  formatTestRailResponse,
  formatJiraRequest,
  getTestCasesPerSuite,
  createJiraTicket
} = require('./utils');
let formattedTestsForJira = []

async function main() {
  // Error handling
  if (process.argv.length < 4) {
    console.error('Missing arguments. Usage: node index.js <sectionId> <jiraEpicId>');
    process.exit(1);
  }

  // Setting vars to inputs
  const sectionId = process.argv[2];
  const jiraEpicId = process.argv[3];

  // Getting all test cases under a section, formatting them, and then pushing them to an array
  const apiResponse = await getTestCasesPerSuite(sectionId)
  
  for (let i = 0; i < apiResponse.cases.length; i++) {
    const responseData = apiResponse.cases[i]
    const responseTitle = apiResponse.cases[i].title
    const formattedResponse = formatTestRailResponse(responseData)
    const responseDict = {[responseTitle]: formattedResponse}
    formattedTestsForJira.push(responseDict)
  }

  // Extract the first test's title and data from the array
  const firstTest = formattedTestsForJira[0];
  const firstTitle = Object.keys(firstTest)[0];
  const firstTestRailData = firstTest[firstTitle];

  // Format the Jira request body and create the Jira ticket
  const jiraRequestBody = formatJiraRequest(firstTitle, jiraEpicId, JSON.stringify(formattedTestsForJira[0]))
  await createJiraTicket(jiraRequestBody);

  /*
  // For every test object in formattedTestsForJira
  for (let test of formattedTestsForJira) {
    // Extract the title and data from the test
    const title = Object.keys(test)[0];
    const testRailData = test[title];

    // Format the Jira request body and create the Jira ticket
    const jiraRequestBody = formatJiraRequest(title, jiraEpicId, testRailData);
    await createJiraTicket(jiraRequestBody);
  }
  */
}

main()