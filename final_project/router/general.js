const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const username = req.body.username;
  const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user, missing username and/or password."});

  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books,null,4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  //console.log(isbn)
  //res.send( JSON.stringify(books[isbn]));

  const isbn = req.params.isbn;

  if (!books.hasOwnProperty(isbn)) {
      console.log("No matching isbn found.", isbn);
      return res.status(400).json({message: "Supplied ISBN is not found in books list"});
  } else {
      let jsonString = JSON.stringify(books[isbn], null, 2);
      console.log("Matching isbn JSON string:", jsonString);
      res.send(jsonString);

  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const author = req.params.author;
  const results = [];

  for (const key in books) {
      if (books[key].author === author) {
          results.push(books[key]);
      }
  }

  if (results.length === 0) {
      console.log("No matching authors found.");
      return res.status(400).json({message: "Supplied Author is not found in books list"});
      
  } else {
      console.log("Matching authors:", results);
      res.send( JSON.stringify(results, null, 2));
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const title = req.params.title;
  const titlesearch = [];

  for (const key in books) {
      if (books[key].title === title) {
        titlesearch.push(books[key]);
      }
  }

  if (titlesearch.length === 0) {
      console.log("No matching title found.");
      return res.status(400).json({message: "Supplied Title is not found in books list"});
      
  } else {
      console.log("Matching title:", title);
      res.send( JSON.stringify(titlesearch, null, 2));
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const isbn = req.params.isbn;
  const results = [];

  for (const key in books) {
      if (key === isbn) {
          results.push(books[key]);
      }
  }

  if (results.length === 0) {
      console.log("No matching isbn found.");
      return res.status(400).json({message: "Supplied ISBN is not found in books list"});
      
  } else {
      console.log("Matching isbn:", results);
      res.send( JSON.stringify(results[0]['reviews'], null, 2));
  }


});

module.exports.general = public_users;
