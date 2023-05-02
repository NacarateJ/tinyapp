const express = require("express");
const request = require("request");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

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

// generateRandomString(6);

// Middleware to translate, or parse the body from the POST request
app.use(express.urlencoded({ extended: true }));

// Middleware to parse the cookies sent in the request and make them
// available in the req.cookies object
app.use(cookieParser());

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
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// Route handler for all "/urls"
app.get("/urls", (req, res) => {
  // We need to send the variables to the EJS template
  // inside an object, so we can use the key of
  // the variable (urls) to access the data
  // within the template
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

// Route to show registration template
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("registration_page", templateVars);
})

// Route to show form for new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

// Route to receive form submission
app.post("/urls", (req, res) => {
  const newURL = req.body.longURL;

  // Check if the website exists or is accessible
  request.get(newURL, (err, response) => {
    if (err || response.statusCode !== 200) {
      // If website does not exist or is not accessible,
      // send error
      res.send("Please provide a valid URL.");
    } else {
      // New id (shortURL)
      const newID = generateRandomString(6);

      // Add new id (shortURL)-longURL key-value pairs to DB
      urlDatabase[newID] = newURL;

      // Use the NEW route to show/view the URL created
      res.redirect(`/urls/${newID}`);
    }
  });
});

// Redirect user to the appropriate longURL site
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  // Error if the user requests a short URL with a non-existant id
  if (!longURL) {
    res.status(404).send("URL not found");
  } else {
    res.redirect(longURL);
  }
});

// Render/ show information about a single URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;

  const templateVars = {
    username: req.cookies["username"],
    id,
    longURL: urlDatabase[id],
  };

  res.render("urls_show", templateVars);
});

// Route to login
app.post("/login", (req, res) => {
  const username = "username";
  const loginValue = req.body.username;

  // Set a cookie named username to the value submitted in
  // the request body via the login form
  res.cookie(username, loginValue);

  res.redirect("/urls");
});

// Rout to logout
app.post("/logout", (req,res) => {
  const username = "username";
  
  // It clears the cookie specified by name
  res.clearCookie(username);

  res.redirect("/urls");
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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
