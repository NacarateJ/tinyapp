const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

// Func to return 6 random alphanumeric characters
function generateRandomString(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
}

generateRandomString(6);

// Middleware to translate, or parse the body from the POST request
app.use(express.urlencoded({ extended: true }));

// Data to show on the URLs page
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Route handler for all "/urls"
app.get("/urls", (req, res) => {
  // We need to send the variables to the EJS template
  // inside an object, so we can use the key of
  // the variable (urls) to access the data
  // within the template
  const templateVars = {
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});


// Route to show new form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})

// Route to receive form submission
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

// Render/ show information about a single URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;

  const templateVars = {
    id,
    longURL: urlDatabase[id],
  };

  res.render("urls_show", templateVars);
});




app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
