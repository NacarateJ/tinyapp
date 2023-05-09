const { assert } = require("chai");
const request = require("request");

const {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  checkWebsiteExists,
} = require("../helpers.js");

/////////////////////////////////////////////////////////////////////
// Tests for generateRandomString
/////////////////////////////////////////////////////////////////////

describe("generateRandomString", function () {
  it("should return a string of 6 random alphanumeric characters", function () {
    const length = 6;
    const result = generateRandomString(length);
    assert.strictEqual(result.length, length);
  });

  it("should only contain alphanumeric characters", function () {
    const result = generateRandomString(6);
    assert.match(result, /^[a-zA-Z0-9]+$/); //'QQxf5Y'
  });

  it("should return different strings each time it is called", function () {
    const result1 = generateRandomString(6);
    const result2 = generateRandomString(6);
    assert.notStrictEqual(result1, result2);
  });
});

/////////////////////////////////////////////////////////////////////
// Tests for getUserByEmail
/////////////////////////////////////////////////////////////////////

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.deepEqual(user, testUsers[expectedUserID]);
  });

  it("should return undefined for a non-existent email", function () {
    const user = getUserByEmail("nonexistent@example.com", testUsers);
    assert.isUndefined(user);
  });
});

/////////////////////////////////////////////////////////////////////
// Tests for urlsForUser
/////////////////////////////////////////////////////////////////////

describe("urlsForUser", function () {
   const testUrlDatabase = {
     abcd: { longURL: "http://example.com", userID: "user1" },
     efgh: { longURL: "http://example.org", userID: "user2" },
     ijkl: { longURL: "http://example.net", userID: "user1" },
   };

  it("should return an object containing the URLs associated with the given user ID", function () {
    const result = urlsForUser("user1", testUrlDatabase);
    const expected = {
      abcd: { longURL: "http://example.com", userID: "user1" },
      ijkl: { longURL: "http://example.net", userID: "user1" },
    };
    assert.deepEqual(result, expected);
  });

  it("should return a message string when the user ID does not own any URLs", function () {
    const result = urlsForUser("user3", testUrlDatabase);
    const expected = "Start creating your short URLs!";
    assert.deepEqual(result, expected);
  });
});

/////////////////////////////////////////////////////////////////////
// Tests for checkWebsiteExists
/////////////////////////////////////////////////////////////////////

describe("checkWebsiteExists", function() {
  it("should return an error message for an invalid URL", function(done) {
    const url = "invalidurl";
    checkWebsiteExists(url, function(err) {
      assert.strictEqual(err, "Please provide a valid URL.");
      done();
    });
  });

  it("should not return an error message for a valid URL", function(done) {
    const url = "https://www.google.com";
    checkWebsiteExists(url, function(err) {
      assert.isNull(err);
      done();
    });
  });
});