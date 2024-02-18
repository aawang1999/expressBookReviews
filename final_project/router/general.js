const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if ((users.filter((user) => user.username === username)).length > 0) {
      return res.status(400).json({message: 'User exists.'});
    } else {
      return res.status(200).json({message: 'User registered.'});
    }
  } else {
    return res.status(400).json({message: 'Unable to register.'});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(books[req.params.isbn]);  
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let results = [];
  for (const [key, val] of Object.entries(books)) {
    const items = Object.entries(val);
    for (let i = 0; i < items.length; i++) {
      if (items[i][0] == 'author' && items[i][1] == req.params.author) {
        results.push(books[key]);
      }
    }
  }
  if (results.length) {
    res.send(results);
  } else {
    return res.status(400).json({message: 'Not found.'});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let results = [];
  for (const [key, val] of Object.entries(books)) {
    const items = Object.entries(val);
    for (let i = 0; i < items.length; i++) {
      if (items[i][0] == 'title' && items[i][1] == req.params.title) {
        results.push(books[key]);
      }
    }
  }
  if (results.length) {
    res.send(results);
  } else {
    return res.status(400).json({message: 'Not found.'});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
