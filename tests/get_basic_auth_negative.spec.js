const { test, expect } = require('../fixtures/baseTest.js');
const logger = require('../utils/logger.js');

test('@auth Verify Basic Authentication negative case', async ({ apiClient }) => {
    const username = 'postman';
    const password = 'passwor';
    logger.info("Get request for basic auth details API");
    const authHeader =
        "Basic " +
        Buffer.from(`${username}:${password}`).toString("base64");

    const response = await apiClient.get(
        "https://postman-echo.com/basic-auth",
        {
            headers: {
                Authorization: authHeader
            }
        }
    );

    logger.info("Get basic auth details API response body " + JSON.stringify(response));
    expect(response.status()).toBe(200);

    console.log(await response.json());

});
