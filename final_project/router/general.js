const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required for Task 10
const doesExist = (username)=>{
  let filtered_users=users.filter((x)=>(x.username===username))
  console.log(users);
  console.log(filtered_users);
  console.log(username);
  
  if(filtered_users.length>0)
    return true;
  else
  return false;
}

//Your registered users are stored in a variable in memory (let users = []) — which resets every time the server restarts.

//nodemon watches for file changes.

//On any change, it restarts the server.
//When the server restarts, users = [] is reinitialized — wiping out previously registered users.
public_users.post("/register", (req,res) => {
  //Write your code here
  let username=req.body.username;
  let password=req.body.password;
  if(!username || !password)
  {
    return res.status(404).json({message: "Username and password are required"});
  }
  if(doesExist(username))
    return res.status(403).json({message: "User already exists"});
  else
  {users.push({username, password});
  res.send("Registration successful")
}
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  console.log(books);
  res.send(JSON.stringify(books));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn;
  let book=books[isbn];
  if(book)
  res.send(JSON.stringify(book));
  else
  res.send("Book not found");
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author=req.params.author;
  filtered_books=Object.values(books).filter((x)=>(x.author.toLowerCase()===author.toLowerCase()))
  res.send(filtered_books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title=req.params.title;
  filtered_books=Object.values(books).filter((x)=>(x.title.toLowerCase()===title.toLowerCase()))
  res.send(filtered_books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn;
  let book=books[isbn];
  console.log(book);
  if(book)
  res.send(JSON.stringify(book.reviews));
  else
  res.send("Book not found");
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;


//Axios is a JavaScript library used to make HTTP requests — like GET, POST, PUT, DELETE — from a client to a server.
//Hey, make a GET request to the / route in our own API server and give me the books.
axios.get('http://localhost:5002/')
  .then((response) => {
    console.log("Book list received from API:");
    console.log(response.data);  // the book list
  })
  .catch((error) => {
    console.error("Error getting books:", error.message);
  });
  axios.get('http://localhost:5002/isbn/3')  // Replace with your server's actual port if needed
  .then((response) => {
    console.log("Book details from Axios call:", response.data);
    console.log(response.data); // send book data back to client
  })
  .catch((error) => {
    console.error("Error fetching book details:", error.message);
  });
  axios.get('http://localhost:5002/author/Jane Austen')  // Replace with your server's actual port if needed
  .then((response) => {
    console.log("Book details from Axios call:", response.data);
    console.log(response.data); // send book data back to client
  })
  .catch((error) => {
    console.error("Error fetching book details:", error.message);
  });
  axios.get('http://localhost:5002/title/Fairy Tales')  // Replace with your server's actual port if needed
  .then((response) => {
    console.log("Book details from Axios call:", response.data);
    console.log(response.data); // send book data back to client
  })
  .catch((error) => {
    console.error("Error fetching book details:", error.message);
  });