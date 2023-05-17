require('dotenv').config()
const axios = require('axios')

// Initializing credentials for API calls
const testRailApi = axios.create({
    baseURL: 'https://interfolio.testrail.com',
    auth: {
        username: process.env.TESTRAIL_USERNAME,
        password: process.env.TESTRAIL_PASSWORD,
    },
})
  
const jiraApi = axios.create({
    baseURL: 'https://interfolio.atlassian.net',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        process.env.JIRA_USERNAME + ':' + process.env.JIRA_API_KEY
      ).toString('base64')}`,
      'Content-Type': 'application/json',
    },
  });   

// Formatting the testrail cases to look nice in Jira
function formatTestRailResponse(response) {
    return returnString = 
    `
    Testrail: C${response.id}
  
    ${response.custom_description}
  
    Preconditions:
    ${response.custom_preconds}
  
    Steps:
    ${response.custom_steps}
  
    Expected Result:
    ${response.custom_expected}
  
    Comments:
    ${response.custom_review_comments}
      `
}

// Formatting jira request body
function formatJiraRequest(title, epicId, testRailData){
    return {
      "fields": {
        "project": {
          "id": "11951"
        },
        "issuetype": {
          "id": "7",
          "operations": [
            "set"
          ]
        },
        "summary": `${title}`,
        "customfield_12171": [],
        "customfield_10400": `${epicId}`,
        "customfield_12121": {
          "id": "11984",
          "value": "2"
        },
        "customfield_12122": {
          "id": "11988",
          "value": "2"
        },
        "priority": {
          "id": "3",
          "name": "Major",
          "iconUrl": "https://interfolio.atlassian.net/images/icons/priorities/major.svg"
        },
        "components": [],
        "customfield_12085": {
          "id": "11887",
          "value": "Team Autobots"
        },
        "customfield_12146": [],
        "description": {
          "version": 1,
          "type": "doc",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": `"${testRailData}"`
                }
              ]
            }
          ]
        },
        "labels": [],
        "fixVersions": [],
        "customfield_12011": [
          {
            "id": "11700",
            "value": "Other"
          }
        ],
        "customfield_12141": []
      },
      "update": {},
      "watchers": [
        "61a4dc7cc15977006abcf460"
      ]
    }
  }

// Getting all test cases under a suite/section in testrail
async function getTestCasesPerSuite(suiteId) {
    try {
      const response = await testRailApi.get(`index.php?/api/v2/get_cases/1&section_id=${suiteId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching test cases:', error)
    }
}

// Creating a Jira ticket
async function createJiraTicket(formattedRequest) {
    /*/
    try {
      const response = await jiraApi.post('/rest/api/2/issue', formattedRequest)
      console.log(response)
      if (response.status === 201) {
        console.log(`Jira ticket successfully created with ID: ${response.data.id}`)
      } else {
        console.log('Unexpected response status:', response.status)
      }
    } catch (error) {
      console.error('Error creating Jira ticket:', error)
    }
    */
    const response = await jiraApi.post('/rest/api/3/issue', formattedRequest)
    console.log(response)
  }  

module.exports = { 
    formatTestRailResponse,
    formatJiraRequest,
    getTestCasesPerSuite,
    createJiraTicket
};