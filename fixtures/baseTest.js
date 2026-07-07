const base = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const ApiClient = require('../utils/apiClient');
const BookingService = require('../services/bookingService');
const apiContext = require('../utils/apiContext');
const { analyzeFailure } = require('../utils/aiAnalyzer');
const logger = require('../utils/logger');
const { attachmentPath, ContentType } = require('allure-js-commons');

const test = base.test.extend({

    apiClient: async ({ request }, use, testInfo) => {
        console.log("******** baseTest Loaded ********");
        apiContext.clear();

        const client = new ApiClient(request, { testInfo });

        await use(client);

    },

    bookingService: async ({ apiClient }, use) => {

        await use(new BookingService(apiClient));

    }

});

test.beforeEach(async ({ }, testInfo) => {

    logger.info(`========== START TEST ==========`);

    logger.info(`Test Name : ${testInfo.title}`);

});

test.afterEach(async ({ }, testInfo) => {

    logger.info(`========== END TEST ==========`);

    logger.info(`Status : ${testInfo.status}`);

    if (
        testInfo.status === testInfo.expectedStatus ||
        process.env.AI_ANALYSIS_ENABLED === "false"
    ) {

        apiContext.clear();

        return;

    }

    try {

        logger.info("Attaching Request...");

        await testInfo.attach("API Request", {

            body: Buffer.from(
                JSON.stringify({
                    method: apiContext.method,
                    url: apiContext.url,
                    headers: apiContext.headers,
                    body: apiContext.requestBody
                }, null, 2)
            ),

            contentType: "application/json"

        });

        logger.info("Attaching Response...");

        await testInfo.attach("API Response", {

            body: Buffer.from(
                JSON.stringify({
                    status: apiContext.status,
                    executionTime: apiContext.executionTime,
                    headers: apiContext.responseHeaders,
                    body: apiContext.responseBody
                }, null, 2)
            ),

            contentType: "application/json"

        });

        logger.info("Calling Ollama AI...");

        const analysis = await analyzeFailure(

            apiContext.snapshot(),

            testInfo.error?.stack ||
            testInfo.error?.message ||
            "Unknown Error"

        );

        logger.info("AI Analysis Generated Successfully.");

        await testInfo.attach("AI Analysis", {

            body: Buffer.from(analysis),

            contentType: "text/plain"

        });

        logger.info("AI Analysis attached to Allure.");

    } catch (err) {

        logger.error("AI Analysis Failed");

        logger.error(err.stack);

        await testInfo.attach("AI Analysis Error", {

            body: Buffer.from(err.stack || err.message),

            contentType: "text/plain"

        });

    } finally {

        apiContext.clear();

    }

});

module.exports = {

    test,

    expect: base.expect

};