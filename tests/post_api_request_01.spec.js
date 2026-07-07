const { test, expect } = require('../fixtures/baseTest.js');


//post api request using static request body
test('Create post API request using static request body', async ({ request }) => {
  const postAPIResponse = await request.post('/booking', {
    data: {
      firstname: "Ashwin",
      lastname: "Netalkar",
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: "2026-05-01",
        checkout: "2026-05-10"
      },
      additionalneeds: "Breakfast"
    }
  });

  
// Validate Status Code and Status Text
expect(postAPIResponse.ok()).toBeTruthy();
expect(postAPIResponse.status()).toBe(200);

const postAPIResponseBody = await postAPIResponse.json();
console.log(postAPIResponseBody);
// Validate JSON Response - flat keys
expect(postAPIResponseBody.booking).toHaveProperty('firstname', 'Ashwin');
expect(postAPIResponseBody.booking).toHaveProperty('lastname', 'Netalkar');

// Validate Nested JSON Objects
expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkin', '2026-05-01');
expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkout', '2026-05-10');
  const postApiResponseBody = await postAPIResponse.json();
  console.log(postApiResponseBody);

  // Optionally add more response validations here
});
