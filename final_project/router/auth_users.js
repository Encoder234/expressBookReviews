const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }

}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  console.log("/login");

  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in, missing username and/or password." });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: username
      //}, 'access', { expiresIn: 60 * 60 });
      }, 'access', { expiresIn: 60  * 60});

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

console.log("2");

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  console.log("HERE /auth/review/:isbn ---> " + req.user.data);
  //return res.status(200).send(req.user.data);

  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!books.hasOwnProperty(isbn)) {
      console.log("No matching isbn found.", isbn);
      return res.status(400).json({message: "Supplied ISBN is not found in books list"});
  } else {

    if (!review || review.trim() === '') {
      return res.status(400).json({ message: 'Review query parameter cannot be empty' });

    } else {
      console.log("Review: ", review);

      const bookReviews = books[isbn].reviews;

      // Add or update the review for the specified username
      if (bookReviews.hasOwnProperty(req.user.data)) {
        // Update existing review
        bookReviews[req.user.data] = review;
        console.log(`Review for ${req.user.data} updated in book ${isbn}: ${review}`);
        return res.status(200).send(`Review for ${req.user.data} updated in book ${isbn}: ${review}`);

      } else {
        // Add new review
        bookReviews[req.user.data] = review;
        console.log(`Review for ${req.user.data} added to book ${isbn}: ${review}`);
        return res.status(200).send(`Review for ${req.user.data} added to book ${isbn}: ${review}`);
      }

    }

  } //if

});


regd_users.delete("/auth/review/:isbn", (req, res) => { 

  const isbn = req.params.isbn;

  if (!books.hasOwnProperty(isbn)) {
    console.log("No matching isbn found.", isbn);
    return res.status(400).json({message: "Supplied ISBN is not found in books list"});
  } else {
    const bookReviews = books[isbn].reviews;
    // Add or update the review for the specified username
    if (bookReviews.hasOwnProperty(req.user.data)) {
      // Update existing review
      //bookReviews[req.user.data] = review;
      //console.log(`Review for ${req.user.data} updated in book ${isbn}: ${review}`);
      //return res.status(200).send(`Review for ${req.user.data} updated in book ${isbn}: ${review}`);

      delete bookReviews[req.user.data];
      console.log(`Deleted Book review of user ${req.user.data} from Book : ${isbn}`);
      return res.status(400).send(`Deleted Book review of user: ${req.user.data} from Book : ${isbn}`);


    } else {
      // Add new review
      //bookReviews[req.user.data] = review;
      console.log(`${req.user.data} Does not have any Review for Book : ${isbn}`);
      return res.status(400).send(`User: ${req.user.data} Does not have any Review for Book : ${isbn}`);
    }


  }


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
