const { askAI } = require('./ollama');

async function analyzeFailure(apiContext, error) {
  const context = {
    method: apiContext.method,
    url: apiContext.url,
    status: apiContext.status,
    requestBody: apiContext.requestBody,
    responseBody: apiContext.responseBody,
    executionTime: apiContext.executionTime
  };

  const prompt = `
Analyze this Playwright API failure briefly.
Return exactly four short sections:
Root Cause:
Recommendation:
Better Assertion:
Best Practice:

API Context:
${JSON.stringify(context, null, 2)}

Playwright Error:
${formatError(error)}
`;

  return askAI(prompt);
}

function formatError(error) {
  if (!error) {
    return 'No Playwright error object was captured.';
  }

  return error.stack || error.message || String(error);
}

module.exports = {
  analyzeFailure
};
