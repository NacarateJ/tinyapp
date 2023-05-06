// Helper function to check for existing users email
const getUserByEmail = function (email, usersDatabase) {
  for (const userID in usersDatabase) {
    if (email === usersDatabase[userID].email) {
      // Returns the specific user object
      return usersDatabase[userID];
    }
  }

  return null;
};

module.exports = { getUserByEmail };