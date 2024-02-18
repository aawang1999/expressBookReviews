const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "username":"John",
    "password":"12345"
  }
];

const isValid = (username)=>{ //returns boolean
  const match = users.filter((user) => user.username === username);
  if (match.length > 0) {
    return true;
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const match = users.filter((user) => user.username === username && user.password === password);
  if (match.length > 0) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Login error."});
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).send("Logged in.");
  } else {
    return res.status(208).json({message: "Login invalid."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).send("Review posted.");
  } else {
    return res.status(404).json({message: 'Not found.'});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send('Deleted.');
  } else {
    return res.status(404).json({message: 'Not found.'});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
