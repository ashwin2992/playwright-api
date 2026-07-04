const { test, expect } = require('@playwright/test');
import { faker }  from '@faker-js/faker';
const { DateTime } = require('luxon');



//post api request using dynamic request body
test('Create post API request using dynamic request body', async ({ request }) => {
  
const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const totalPrice = faker.number.int({ max: 10000 });
const checkInDate = DateTime.now().toFormat('yyyy-MM-dd');
const checkOutDate = DateTime.now().plus({ days: 5 }).toFormat('yyyy-MM-dd');

  const postAPIResponse = await request.post('/booking', {
    data: {
      firstname: firstName,
      lastname: lastName,
      totalprice: totalPrice,
      depositpaid: true,
      bookingdates: {
        checkin: checkInDate,
        checkout: checkOutDate
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
expect(postAPIResponseBody.booking).toHaveProperty('firstname', firstName);
expect(postAPIResponseBody.booking).toHaveProperty('lastname', lastName);

// Validate Nested JSON Objects
expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkin', checkInDate);
expect(postAPIResponseBody.booking.bookingdates).toHaveProperty('checkout', checkOutDate);
const postApiResponseBody = await postAPIResponse.json();

  // Optionally add more response validations here
});