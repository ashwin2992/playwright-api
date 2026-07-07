const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const apiContext = require('../utils/apiContext.js');
const { analyzeFailure } = require('../utils/aiAnalyzer.js');
const { attachmentPath, ContentType } = require('allure-js-commons');

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus || process.env.AI_ANALYSIS_ENABLED === 'false') {
    return;
  }

  const aiResult = await analyzeFailure(apiContext.snapshot(), testInfo.error);
  const reportsDir = path.resolve(process.cwd(), 'reports', 'ai-analysis');
  fs.mkdirSync(reportsDir, { recursive: true });

  const safeTitle = testInfo.title.replace(/[\\/:*?"<>|]/g, '_');
  const fileName = `${safeTitle}.txt`;
  const filePath = path.join(reportsDir, fileName);
  const outputPath = testInfo.outputPath(fileName);
  fs.writeFileSync(filePath, aiResult, 'utf8');
  fs.writeFileSync(outputPath, aiResult, 'utf8');

  await testInfo.attach('ollama-failure-analysis', {
    path: outputPath,
    contentType: 'text/plain'
  });

  await attachmentPath('ollama-failure-analysis', outputPath, ContentType.TEXT);
});
