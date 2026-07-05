const { test, expect } = require('@playwright/test')
import { stringFormat } from '../utils/common.js'
import { faker } from '@faker-js/faker';
const { DateTime } = require('luxon');
const jsonAPIPostRequestData = require('../testdata/post_request_dynamic_body.json');
const logger = require('../utils/logger.js');

//get api request using static request body
test('Create get with query parameter API request using dynamic json request body', async ({ request }) => {

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalPrice = faker.number.int({ max: 10000 });
  const checkInDate = DateTime.now().toFormat('yyyy-MM-dd');
  const checkOutDate = DateTime.now().plus({ days: 5 }).toFormat('yyyy-MM-dd');

  const dynamicformattedString = stringFormat(JSON.stringify(jsonAPIPostRequestData), firstName, lastName, checkInDate, checkOutDate);

  logger.info("Get User details API");
  const postAPIResponse = await request.post('/booking', {

    data: JSON.parse(dynamicformattedString)
  });


  // Validate Status Code and Status Text
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  const postAPIResponseBody = await postAPIResponse.json();
  
  logger.info("Get User details API response body "+JSON.stringify(postAPIResponseBody));
  console.log(postAPIResponseBody);
  const bId = postAPIResponseBody.bookingid;

  // Validate JSON Response - flat keys
  expect(postAPIResponseBody.booking).toHaveProperty('firstname', firstName);
  expect(postAPIResponseBody.booking).toHaveProperty('lastname', lastName);

  // Validate Nested JSON Objects
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkin', checkInDate);
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkout', checkOutDate);


  // Optionally add more response validations here
  console.log("==========================================");
  const getAPIResponse = await request.get('/booking/${bId}');


  const getAPIResponseBody = await postAPIResponse.json();

  console.log(getAPIResponseBody);
  expect(getAPIResponseBody.booking).toHaveProperty('firstname', firstName);
  expect(getAPIResponseBody.booking).toHaveProperty('lastname', lastName);

  // Validate Nested JSON Objects
  expect(getAPIResponseBody.booking.bookingdates).toHaveProperty('checkin', checkInDate);
  expect(getAPIResponseBody.booking.bookingdates).toHaveProperty('checkout', checkOutDate);


});