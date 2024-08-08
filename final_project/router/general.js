const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const fs = require('fs').promises; // Import the promises API from the 'fs' module


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
//public_users.get('/',function (req, res) {
//  res.send(JSON.stringify(books,null,4));
//});


/*----------- async public_users.get('/'-----------------------------------
let books;

// Function to read books asynchronously
async function getBooks() {
  try {
    // Read the file asynchronously
    const data = await fs.readFile("./mybooks.json", 'utf8');
    // Parse the JSON data
    console.log(data)
    books = JSON.parse(data);
    return books;
  } catch (error) {
    console.error('Error reading the books file:', error);
    throw error; // Re-throw the error to be handled in the route
  }
}

// Route to get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Get the book list by reading the file asynchronously
    books = await getBooks();
    // Send the book list as a JSON response
    res.json(books);
  } catch (error) {
    // Handle any potential errors
    res.status(500).send('Error fetching books');
  }
});
*/

// Route to get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Simulate an async operation (even though it's synchronous here)
    const bookList = await new Promise((resolve) => {
      resolve(books);
    });

    // Send the book list as a JSON response
    res.json(bookList);
  } catch (error) {
    // Handle any potential errors
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
});



/*---------------- ORIG ------------------------------------------
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;

  if (!books.hasOwnProperty(isbn)) {
      console.log("No matching isbn found.", isbn);
      return res.status(400).json({message: "Supplied ISBN is not found in books list"});
  } else {
      let jsonString = JSON.stringify(books[isbn], null, 2);
      console.log("Matching isbn JSON string:", jsonString);
      res.send(jsonString);

  }
 }); */



// Get book details based on ISBN usin promise ------------------------------------------
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Create a promise to find the book by ISBN
  const findBookByISBN = new Promise((resolve, reject) => {
    if (books.hasOwnProperty(isbn)) {
      resolve(books[isbn]);
    } else {
      reject(`No matching ISBN found: ${isbn}`);
    }
  });

  // Handle the promise
  findBookByISBN
    .then((book) => {
      const jsonString = JSON.stringify(book, null, 2);
      console.log("Matching ISBN JSON string:", jsonString);
      res.send(jsonString);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: "Supplied ISBN is not found in books list" });
    });
  });


/*------------------ ORIG --------------------------------------------------
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

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

}); */


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Create a promise to find books by author
  const findBooksByAuthor = new Promise((resolve, reject) => {
    const results = [];

    // Iterate over the books to find matches
    for (const key in books) {
      if (books[key].author === author) {
        results.push(books[key]);
      }
    }

    // Resolve or reject the promise based on the results
    if (results.length > 0) {
      resolve(results);
    } else {
      reject(`No matching authors found for: ${author}`);
    }
  });

  // Handle the promise
  findBooksByAuthor
    .then((booksByAuthor) => {
      console.log("Matching authors:", booksByAuthor);
      res.send(JSON.stringify(booksByAuthor, null, 2));
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: "Supplied Author is not found in books list" });
    });
});





/*-------------------- ORIG ---------------------------------------
// Get all books based on title
public_users.get('/title/:title',function (req, res) {

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
}); */


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Create a promise to find books by title
  const findBooksByTitle = new Promise((resolve, reject) => {
    const titlesearch = [];

    // Iterate over the books to find matches
    for (const key in books) {
      if (books[key].title === title) {
        titlesearch.push(books[key]);
      }
    }

    // Resolve or reject the promise based on the results
    if (titlesearch.length > 0) {
      resolve(titlesearch);
    } else {
      reject(`No matching title found for: ${title}`);
    }
  });

  // Handle the promise
  findBooksByTitle
    .then((booksByTitle) => {
      console.log("Matching title:", title);
      res.send(JSON.stringify(booksByTitle, null, 2));
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: "Supplied Title is not found in books list" });
    });
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
