# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs. This project was created as part of a web development course and serves as a demonstration of building a simple CRUD (Create, Read, Update, Delete) application.

## Features

- Users must register to create a shortened URL.
- Users can create a shortened version of a long URL.
- Users can view a list of their shortened URLs.
- Users can edit the long URL associated with their shortened URL.
- Users can delete a shortened URL from their list.
- Passwords are hashed using `bcryptjs` for security.
- User sessions are maintained using `cookie-session`.
- `EJS` is used as a template engine to render dynamic content on the client-side.
- `request` is used to make `HTTP` requests to external `APIs`.
- The development environment includes `Chai` and `Mocha` for testing.

## Technologies Used

- [Node.js](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- [Bootstrap CSS](https://getbootstrap.com/docs/4.3/getting-started/introduction/#:~:text=Specifically%2C%20they%20require%20jQuery%2C%20Popper,and%20our%20own%20JavaScript%20plugins.)

## Dependencies

- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cookie-session](https://www.npmjs.com/package/cookie-session)
- [EJS](https://ejs.co/)
- [Request](https://www.npmjs.com/package/request)

## Development Dependencies

- [Chai](https://www.npmjs.com/package/chai)
- [Mocha](https://www.npmjs.com/package/mocha)
- [Nodemon](https://www.npmjs.com/package/nodemon)

## Getting Started

- Clone this repository to your local machine.
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.
- To test the helper functions run `npm test`.
- Open your browser and navigate to http://localhost:8080/

## Final Product

URLs page fo a user that just signed up or didn't creat any shor URL yet:
!["URLs page fo a user that just signed up or didn't creat any shor URL yet"](https://github.com/NacarateJ/tinyapp/blob/master/docs/urls-page.png?raw=true)

URLs page for a user that owns a few URLs:
!["URLs page for a user that owns a few URLs"](https://github.com/NacarateJ/tinyapp/blob/master/docs/urls-page2.png?raw=true)

Edit URL page:
!["Edit URL page"](https://github.com/NacarateJ/tinyapp/blob/master/docs/edit-page.png?raw=true)

