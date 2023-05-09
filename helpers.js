const request = require("request");

/////////////////////////////////////////////////////////////////////
// Helper Functions
/////////////////////////////////////////////////////////////////////

// Func to return 6 random alphanumeric characters
const generateRandomString = function (length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Helper function to check for existing users email
const getUserByEmail = function (email, usersDatabase) {
  for (const userID in usersDatabase) {
    if (email === usersDatabase[userID].email) {
      // Returns the specific user object
      return usersDatabase[userID];
    }
  }

  return undefined;
};

// Ckeck if the user have URLs to show
const urlsForUser = function (id, urlDatabase) {
  const userURLs = {};

  for (const url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      userURLs[url] = urlDatabase[url];
    }
  }

  if (Object.keys(userURLs).length === 0) {
    return "Start creating your short URLs!";
  }

  return userURLs;
};

// Check if the website exists or is accessible
const checkWebsiteExists = (url, cb) => {
  request.get(url, (err, resp) => {
    if (err || resp.statusCode !== 200) {
      return cb("Please provide a valid URL.");
    }
    cb(null);
  });
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  checkWebsiteExists,
};
