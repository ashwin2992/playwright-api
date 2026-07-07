const { test, expect } = require('../fixtures/baseTest.js')
const jsonAPIPostRequestData = require('../testdata/post_request_body.json')


//post api request using static request body
test('Create post API request using static request body', async ({ request }) => {
  const postAPIResponse = await request.post('/booking', {
  
 data: jsonAPIPostRequestData
  });

  
// Validate Status Code and Status Text
expect(postAPIResponse.ok()).toBeTruthy();
expect(postAPIResponse.status()).toBe(200);

const postAPIResponseBody = await postAPIResponse.json();
console.log(postAPIResponseBody);
// Validate JSON Response - flat keys
expect(postAPIResponseBody.booking).toHaveProperty('firstname', 'AshwinJ');
expect(postAPIResponseBody.booking).toHaveProperty('lastname', 'NetalkarJ');

// Validate Nested JSON Objects
expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkin', '2026-05-01');
expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkout', '2026-05-10');
  const postApiResponseBody = await postAPIResponse.json();
  console.log(postApiResponseBody);

  // Optionally add more response validations here
});
