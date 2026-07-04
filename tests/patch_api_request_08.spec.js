const { test, expect } = require('@playwright/test');
const postRequest = require('../testdata/post_request_body.json');
const tokenRequest = require('../testdata/token_request_body.json');
const patchRequest = require('../testdata/patch_request_body.json'); 
const { json } = require('stream/consumers');

test("Patch api request using static body ", async ({ request }) => {
  // create post api request using playwright
  const postAPIResponse = await request.post("/booking", {
    data: postRequest,
  });
const postAPIResponseBody = await postAPIResponse.json();
console.log(postAPIResponseBody);
console.log("============================");
  const bookingId = await postAPIResponse.json();
  const bId = bookingId.bookingid;

  // create GET api request using playwright
  const getAPIResponse = await request.get("/booking/", {
    params: {
      firstname: "playwright",
      lastname: "api testing",
    },
  });

  // validate status code
  console.log(await getAPIResponse.json());
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);

  // generate token
  const tokenAPIResponse = await request.post("/auth", {
    data: tokenRequest,
  });
  expect(tokenAPIResponse.ok()).toBeTruthy();
  expect(tokenAPIResponse.status()).toBe(200);

  console.log(await tokenAPIResponse.json());
  const tokenResponseBody = await tokenAPIResponse.json();
  const tokenNo = tokenResponseBody.token;

  // partial update booking details
  const patchAPIResponse = await request.patch(`/booking/${bId}`, {
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${tokenNo}`
    },
    data: patchRequest,
  });

  console.log(await patchAPIResponse.json());
  expect(patchAPIResponse.ok()).toBeTruthy();
  expect(patchAPIResponse.status()).toBe(200);
});
