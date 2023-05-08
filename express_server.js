/////////////////////////////////////////////////////////////////////
// Dependencies
/////////////////////////////////////////////////////////////////////

// Modules
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require("./helpers");

const {urlDatabase, users} = require("./database");

// NPM packages
const express = require("express");
const request = require("request");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");

/////////////////////////////////////////////////////////////////////
// Initialization
/////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080;

/////////////////////////////////////////////////////////////////////
// Middlewares
/////////////////////////////////////////////////////////////////////

// Translate, or parse the body from the POST request
app.use(express.urlencoded({ extended: true }));

// Sets up encrypted cookies with security features representing the session
app.use(
  cookieSession({
    name: "express_app_session_id",
    keys: ["lfdk92jv9e40gjd", "2k5hc7d8f1n0sgj"],
  })
);

/////////////////////////////////////////////////////////////////////
// Configuration
/////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");

/////////////////////////////////////////////////////////////////////
// Routes - Registration - Login
/////////////////////////////////////////////////////////////////////

// Route to show registration template
app.get("/register", (req, res) => {
  const userID = req.session.user_id;

  const user = users[userID];
  
  const templateVars = {
    user,
  };

  if (user) {
    return res.redirect("/urls");
  }

  res.render("registration_page", templateVars);
});

// Route to handle users registration form data
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Please provide a valid email and password.");
  }

  const findEmail = getUserByEmail(email, users);

  if (findEmail) {
    return res.status(400).send("Email already exist.");
  }

  const id = generateRandomString(6);

  // Hash our password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  // Add new user to users DB
  users[id] = { id, email, hash };

  // Set a cookie named user_id containing the user's
  // newly generated ID
  // res.cookie("user_id", id);
  req.session.user_id = id;

  res.redirect("/urls");
});

// Route to serve the login_page - template to the user
app.get("/login", (req, res) => {
  const userID = req.session.user_id;

  const user = users[userID];

  const templateVars = {
    user,
  };
  
  if (user) {
    return res.redirect("/urls");
  }

  res.render("login_page", templateVars);
});

// Route to handle login form submition and user authentication
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Please provide a valid email and password.");
  }

  const user = getUserByEmail(email, users);

  // If there is no match
  if (!user) {
    return res.status(403).send("No user found with that email.");
  }

  // Compare ecrypted password
  const passwordMatch = bcrypt.compareSync(password, user["hash"]); // true || false

  // if the login inf. matches a existing user
  if (user["email"] === email && passwordMatch) {
    // res.cookie("user_id", user["id"]);
    req.session.user_id = user["id"];
    return res.redirect("/urls");
  }

  if (passwordMatch === false) {
    return res.status(400).send("Password does not match.");
  }
});

/////////////////////////////////////////////////////////////////////
// Routes - URLs
/////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  const userID = req.session.user_id;

  const user = users[userID];

  if (user) {
    return res.redirect("/urls");
  }

  return res.redirect("/login");
})

// Route handler for all "/urls"
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;

  const user = users[userID];

  const userURLs = urlsForUser(userID, urlDatabase);

  if (user) {
    // We need to send the variables to the EJS template
    // inside an object, so we can use the key of
    // the variable (urls) to access the data
    // within the template
    const templateVars = {
      user,
      userURLs,
    };
    
    res.render("urls_index", templateVars);
  } else {
    return res.status(400).send("Please login or register.");
  }
});


// Route to show form for new URL
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;

  const user = users[userID];

  const templateVars = {
    user,
  };

  if (!user) {
    return res.redirect("/login");
  }
  
  res.render("urls_new", templateVars);
});

// Route to receive URL form submission
app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];

  if (!user) {
    return res.send("Please login or register to create short URLs.");
  }

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
    urlDatabase[newID] = {
      longURL: newURL,
      userID: userID,
    };

    // Use the NEW route to show/view the URL created
    res.redirect(`/urls/${newID}`);
  });
});

// Redirect user to the appropriate longURL site
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  // Error if the user requests a short URL with a non-existant id
  if (!longURL) {
    return res.status(404).send("URL not found");
  }
  res.redirect(longURL);
});

// Render/ show information about a single URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const userID = req.session.user_id;
  const user = users[userID];

  if (!user) {
    return res.send("Please login or register start creating short URLs.");
  }

  // Only the owner of the URL can access it
  if (urlDatabase[id].userID !== userID) {
    return res.send("Access denied.");
  }

  const longURL = urlDatabase[id].longURL;
  // Error if the user requests a short URL with a non-existant id
  if (!longURL) {
    return res.status(404).send("URL not found");
  }

  const templateVars = {
    user,
    id,
    longURL,
  };

  res.render("urls_show", templateVars);
});

// Edit URL
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const updatedUrl = req.body.longURL;
  const userID = req.session.user_id;
  const user = users[userID];

  // Check if the user is logged in
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  // Check if the URL ID exists in the database
  if (!urlDatabase[id]) {
    return res.status(404).send("URL not found");
  }

  // Check if the user is the owner of the URL
  if (urlDatabase[id].userID !== userID) {
    return res.status(401).send("Unauthorized");
  }

  // Update URL in DB
  urlDatabase[id].longURL = updatedUrl;

  // Use the NEW route to show/view the URL created
  res.redirect("/urls");
});

// Delete URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const userID = req.session.user_id;
  const user = users[userID];

  // Check if the user is logged in
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  // Check if the URL ID exists in the database
  if (!urlDatabase[id]) {
    return res.status(404).send("URL not found");
  }

  // Check if the user is the owner of the URL
  if (urlDatabase[id].userID !== userID) {
    return res.status(401).send("Unauthorized");
  }

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
  req.session = null;

  res.redirect("/login");
});

/////////////////////////////////////////////////////////////////////
// Listener
/////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

