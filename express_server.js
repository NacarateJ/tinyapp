/////////////////////////////////////////////////////////////////////
// Requires
/////////////////////////////////////////////////////////////////////

const express = require("express");
const request = require("request");
const cookieParser = require("cookie-parser");

/////////////////////////////////////////////////////////////////////
// Initialization
/////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080;

/////////////////////////////////////////////////////////////////////
// Middlewares
/////////////////////////////////////////////////////////////////////

// Middleware to translate, or parse the body from the POST request
app.use(express.urlencoded({ extended: true }));

// Middleware to parse the cookies sent in the request and make them
// available in the req.cookies object
app.use(cookieParser());

/////////////////////////////////////////////////////////////////////
// Configuration
/////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");

/////////////////////////////////////////////////////////////////////
// Database - URL - Users
/////////////////////////////////////////////////////////////////////

// Data to show on the URLs page
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Object to store users
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

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
const getUserByEmail = function (email) {
  for (const userID in users) {
    if (email === users[userID].email) {
      // Returns the specific user object
      return users[userID];
    }
  }
  
  return null;
};

/////////////////////////////////////////////////////////////////////
// Routes - Registration - Login
/////////////////////////////////////////////////////////////////////

// Route to show registration template
app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];

  const user = users[userID];

  const templateVars = {
    user,
  };
  res.render("registration_page", templateVars);
});

// Route to handle users registration form data
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    return res.status(400).send("Please provide a valid email and password.");
  }

  const findEmail = getUserByEmail(email);

  if (findEmail) {
    return res.status(400).send("Email already exist.");
  }

  const id = generateRandomString(6);

  // Add new user to users DB
  users[id] = { id, email, password };

  // Set a cookie named user_id containing the user's
  // newly generated ID
  res.cookie("user_id", id);

  res.redirect("/urls");
});

// Route to serve the login_page - template to the user
app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];

  const user = users[userID];

  const templateVars = {
    user,
  };
  
  res.render("login_page", templateVars);
});

// Route to handle login form submition and user authentication
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    return res.status(400).send("Please provide a valid email and password.");
  }

  const user = getUserByEmail(email);

  // If there is no match
  if (!user) {
    return res.status(403).send("Invalid email or password");
  }

  // if the login inf. matches a existing user
  if (user["email"] === email && user["password"] === password) {
    res.cookie("user_id", user["id"]);
    return res.redirect("/urls");
  }
});

/////////////////////////////////////////////////////////////////////
// Routes - URLs
/////////////////////////////////////////////////////////////////////

// Route handler for all "/urls"
app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];

  const user = users[userID];

  // We need to send the variables to the EJS template
  // inside an object, so we can use the key of
  // the variable (urls) to access the data
  // within the template
  const templateVars = {
    user,
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

// Route to show form for new URL
app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];

  const user = users[userID];

  const templateVars = {
    user,
  };
  res.render("urls_new", templateVars);
});

// Route to receive URL form submission
app.post("/urls", (req, res) => {
  const newURL = req.body.longURL;

  // Check if the website exists or is accessible
  request.get(newURL, (err, response) => {
    if (err || response.statusCode !== 200) {
      // If website does not exist or is not accessible,
      // send error
      return res.send("Please provide a valid URL.");
    }
    // New id (shortURL)
    const newID = generateRandomString(6);

    // Add new id (shortURL)-longURL key-value pairs to DB
    urlDatabase[newID] = newURL;

    // Use the NEW route to show/view the URL created
    res.redirect(`/urls/${newID}`);
  });
});

// Redirect user to the appropriate longURL site
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  // Error if the user requests a short URL with a non-existant id
  if (!longURL) {
    return res.status(404).send("URL not found");
  }
  res.redirect(longURL);
});

// Render/ show information about a single URL
app.get("/urls/:id", (req, res) => {
  const userID = req.cookies["user_id"];

  const user = users[userID];

  const id = req.params.id;

  const templateVars = {
    user,
    id,
    longURL: urlDatabase[id],
  };

  res.render("urls_show", templateVars);
});

// Edit URL
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;

  const updatedUrl = req.body.longURL;

  // Update URL in DB
  urlDatabase[id] = updatedUrl;

  // Use the NEW route to show/view the URL created
  res.redirect("/urls");
});

// Delete URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  // The delete operator removes a property from an object
  delete urlDatabase[id];

  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////
// Route - Logout
/////////////////////////////////////////////////////////////////////

// Rout to logout
app.post("/logout", (req, res) => {
  // It clears the cookie specified by name
  res.clearCookie("user_id");

  res.redirect("/login");
});

/////////////////////////////////////////////////////////////////////
// Listener
/////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
