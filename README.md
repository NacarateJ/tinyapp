# TinyApp Project

TinyApp is a multipage full stack web application with authentication protection that reacts appropriately to the user's logged-in state. It was built with Node and Express and allows registered users to create a shortened URL. Once logged in, they can access their dashboard where they can view, create, edit and delete their shortened URLs. The application provides feedback to the user based on their logged-in state, directing them to the appropriate page for their action.

This project was created as part of a web development course and serves as a demonstration of building a simple CRUD (Create, Read, Update, Delete) application with user's with authentication protection.

## Features

- Users can view, create, edit and delete their shortened URLs.
- Passwords are hashed using `bcryptjs` for security.
- User sessions are maintained using `cookie-session`.
- `EJS` is used as a template engine to render dynamic content on the client-side.
- `request` is used to make `HTTP` requests to external `APIs`.
- The development environment includes `Chai` and `Mocha` for testing.

## Technologies

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

<div align="center">

https://user-images.githubusercontent.com/114256348/237000694-f7a0e077-5ac4-4d6d-b084-532a2fa03198.mp4

<div/>



