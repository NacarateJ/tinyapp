/////////////////////////////////////////////////////////////////////
// Database - URL - Users
/////////////////////////////////////////////////////////////////////

// Data to show on the URLs page
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "FV0qwV",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "N7Porb",
  },
};

// Object to store users
// All passwords/ hash = 1234
const users = {
  FV0qwV: {
    id: "FV0qwV",
    email: "user@example.com",
    hash: "$2a$10$.5UR8Og.2kSQ8xx6Pr9Vx.smflmQ0imqxodRtusY3NkdfdCg1OdPy",
  },
  N7Porb: {
    id: "N7Porb",
    email: "user2@example.com",
    hash: "$2a$10$Y8li1knP1lcFGjp7cyqbiufndJ1xijUoZo3x7Pcy79AYajZ0jMMtG",
  },
  dYNYhU: {
    id: "dYNYhU",
    email: "user3@example.com",
    hash: "$2a$10$XmdpBeNUrd7XqLHJncCsf.FvfniRSylby.gaVpN7tDj67pr0z0qLu",
  },
};


module.exports = {urlDatabase, users};