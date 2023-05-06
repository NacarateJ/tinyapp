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
const urlsForUser = function (id) {
  const userURLs = {};
  let foundURL = false;

  for (const url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      userURLs[url] = urlDatabase[url];
      foundURL = true;
    }
  }

  if (!foundURL) {
    return "Start creating your short URLs!";
  }

  return userURLs;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser
};
