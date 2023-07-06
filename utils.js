require('dotenv').config()
const axios = require('axios')
const btoa = require('btoa')

const credentials = btoa(`${ process.env.TESTRAIL_USERNAME }:${ process.env.TESTRAIL_PASSWORD }`)

// Initializing credentials for API calls
const testRailApi = axios.create({
  baseURL: 'https://interfolio.testrail.com',
  headers: {
    'Authorization': `Basic ${ credentials }`,
    'Content-Type': 'application/json'
  }
})

const jiraApi = axios.create({
  baseURL: 'https://interfolio.atlassian.net',
  headers: {
    'Authorization': `Basic ${ Buffer.from(
      process.env.JIRA_USERNAME + ':' + process.env.JIRA_API_KEY
    ).toString('base64') }`,
    'Content-Type': 'application/json',
  },
})

// Formatting jira request body
function formatJiraRequest(title, epicId, testRailData) {
  return {
    'fields': {
      'project': {
        'id': '11951'
      },
      'issuetype': {
        'id': '7',
        'operations': [
          'set'
        ]
      },
      'summary': `${ title }`,
      'customfield_12171': [],
      'customfield_10400': `${ epicId }`,
      'customfield_12121': {
        'id': '11984',
        'value': '2'
      },
      'customfield_12122': {
        'id': '11988',
        'value': '2'
      },
      'priority': {
        'id': '3',
        'name': 'Major',
        'iconUrl': 'https://interfolio.atlassian.net/images/icons/priorities/major.svg'
      },
      'components': [],
      'customfield_12085': {
        'id': '11887',
        'value': 'Team Autobots'
      },
      'customfield_12146': [],
      'description': {
        'version': 1,
        'type': 'doc',
        'content': [
          // Testrail ID
          {
            'type': 'paragraph',
            'content': [
              {
                'type': 'text',
                'text': `Testrail: C${ testRailData.id }`
              }
            ]
          },
          // Story
          {
            'type': 'paragraph',
            'content': [
              {
                'type': 'text',
                'text': `Description:\n${ testRailData.custom_description }`
              }
            ]
          },
          // Preconditions
          {
            'type': 'paragraph',
            'content': [
              {
                'type': 'text',
                'text': `Preconditions:\n${ testRailData.custom_preconds }`
              }
            ]
          },
          // Steps
          {
            'type': 'paragraph',
            'content': [
              {
                'type': 'text',
                'text': `Steps:\n${ testRailData.custom_steps }`
              }
            ]
          },
          // Expected results
          {
            'type': 'paragraph',
            'content': [
              {
                'type': 'text',
                'text': `Expected Results:\n${ testRailData.custom_expected }`
              }
            ]
          },
          // Comments
          {
            'type': 'paragraph',
            'content': [
              {
                'type': 'text',
                'text': `Comments:\n${ testRailData.custom_review_comments }`
              }
            ]
          }
        ]
      },
      'labels': [],
      'fixVersions': [],
      'customfield_12011': [
        {
          'id': '11700',
          'value': 'Other'
        }
      ],
      'customfield_12141': []
    },
    'update': {},
    'watchers': [
      '61a4dc7cc15977006abcf460'
    ]
  }
}

// Getting all test cases under a suite/section in testrail
async function getTestCasesPerSuite(suiteId) {
  try {
    const response = await testRailApi.get(`index.php?/api/v2/get_cases/1&section_id=${ suiteId }`)
    return response.data
  } catch(error) {
    console.error('Error fetching test cases:', error)
  }
}

// Creating a Jira ticket
async function createJiraTicket(formattedRequest) {
  try {
    const response = await jiraApi.post('/rest/api/3/issue', formattedRequest)
    if(response.status === 201) {
      // eslint-disable-next-line no-console
      console.log(`Jira ticket successfully created with ID: ${ response.data.key }`)
      return response.data.key
    } else {
      // eslint-disable-next-line no-console
      console.log('Unexpected response status:', response.status)
    }
  } catch(error) {
    console.error('Error creating Jira ticket:', error)
  }
}

// Getting a single test case from TestRail
async function getSingleTestCase(testCaseId) {
  try {
    const response = await testRailApi.get(`/index.php?/api/v2/get_case/${ testCaseId }`)
    return response.data
  } catch(error) {
    console.error(`Error fetching test case with ID ${ testCaseId }:`, error)
  }
}

async function updateTestRailAutomationStatus(testCaseId) {
  const formattedRequest = {
    custom_execution_type: 2
  }
  try {
    const response = await testRailApi.post(`index.php?/api/v2/update_case/${ testCaseId }`, formattedRequest)
    return response.data
  } catch(error) {
    console.error('Error fetching test cases:', error)
  }
}

async function updateTestRailReference(testCaseId, newJiraTicketId) {
  const formattedRequest = {
    refs: newJiraTicketId
  }
  try {
    const response = await testRailApi.post(`index.php?/api/v2/update_case/${ testCaseId }`, formattedRequest)
    return response.data
  } catch(error) {
    console.error('Error fetching test cases:', error)
  }
}

module.exports = {
  formatJiraRequest,
  getTestCasesPerSuite,
  createJiraTicket,
  getSingleTestCase,
  updateTestRailReference,
  updateTestRailAutomationStatus
}