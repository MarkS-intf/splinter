require('dotenv').config();
const axios = require('axios');
let formattedTestsForJira = []

// Initializing credentials for API calls
const testRailApi = axios.create({
  baseURL: 'https://interfolio.testrail.com',
  auth: {
    username: process.env.TESTRAIL_USERNAME,
    password: process.env.TESTRAIL_PASSWORD,
  },
});

const jiraApi = axios.create({
  baseURL: 'https://interfolio.atlassian.net',
  auth: {
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_PASSWORD,
  },
});

// Formatting the testrail cases to look nice in Jira
function formatTestRailResponse(response) {
  return returnString = 
  `
  Testrail: C${response.data.id}

  ${response.data.custom_description}

  Preconditions:
  ${response.data.custom_preconds}

  Steps:
  ${response.data.custom_steps}

  Expected Result:
  ${response.data.custom_expected}

  Comments:
  ${response.data.custom_review_comments}
    `
}

// Getting all test cases under a suite/section in testrail
async function getTestCasesPerSuite(projectId , suiteId) {
  try {
    const response = await testRailApi.get(`index.php?/api/v2/get_cases/${projectId}&section_id=${suiteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test cases:', error);
  }
}

/*
async function createJiraTicket(issueData) {
  try {
    const response = await jiraApi.post('/rest/api/2/issue', issueData);
    console.log('Jira ticket created:', response.data.key);
  } catch (error) {
    console.error('Error creating Jira ticket:', error);
  }
}*/

async function main() {
  // Setting vars to inputs
  const testRailProjectId = 1;
  const testRailSuiteId = process.argv[3];
  const jiraProjectKey = process.argv[4];
  const jiraIssueType = process.argv[5];

  // Getting all test cases under a section, formatting them, and then pushing them to an array
  const apiResponse = await getTestCasesPerSuite(testRailProjectId, testRailSuiteId)
  for (let i = 0; i < apiResponse.data.length; i++) {
    const responseData = apiResponse.data[i];
    const formattedResponse = formatTestRailResponse(responseData);
    formattedTestsForJira.push(formattedResponse);
  }
}

main()