const { test, expect } = require('../fixtures/baseTest.js')
const { stringFormat } = require('../utils/common.js');
const { faker } = require('@faker-js/faker');
const { DateTime } = require('luxon');
const jsonAPIPostRequestData = require('../testdata/post_request_dynamic_body.json')

//post api request using static request body
test('Create GET with query parameter API request using dynamic json request body', async ({ request }) => {

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalPrice = faker.number.int({ max: 10000 });
  const checkInDate = DateTime.now().toFormat('yyyy-MM-dd');
  const checkOutDate = DateTime.now().plus({ days: 5 }).toFormat('yyyy-MM-dd');

  const dynamicformattedString = stringFormat(JSON.stringify(jsonAPIPostRequestData), firstName, lastName, checkInDate, checkOutDate);


  const postAPIResponse = await request.post('/booking', {

    data: JSON.parse(dynamicformattedString)
  });


  // Validate Status Code and Status Text
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  const postAPIResponseBody = await postAPIResponse.json();

  console.log(postAPIResponseBody);
  const bId = postAPIResponseBody.bookingid;

  // Validate JSON Response - flat keys
  expect(postAPIResponseBody.booking).toHaveProperty('firstname', firstName);
  expect(postAPIResponseBody.booking).toHaveProperty('lastname', lastName);

  // Validate Nested JSON Objects
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkin', checkInDate);
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkout', checkOutDate);


  // get call add more response validations here
  console.log("==========================================");
  const getAPIResponse = await request.get('/booking/', {
    params: {
      firstname: firstName,
      lastname: lastName
    }

  });


  const getAPIResponseBody = await getAPIResponse.json();

  console.log(getAPIResponseBody);
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);
});
