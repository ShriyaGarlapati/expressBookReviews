const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  console.log("In Login: ", req.body);
  let username=req.body.username;
  let password=req.body.password;
  if(!username || !password)
  {
    console.log(username);
    console.log(password);
    return res.status(400).json({message: "Username and password are required"});
  }
  console.log("Users are: ", users);
  console.log("Username is: ",username);
  console.log("Password is: ", password);
  let filtered_users=users.filter((x)=>(x.username===username && x.password===password));
  console.log("Filtered users are: ", filtered_users);
  if(filtered_users.length>0)
  {
    let accessToken=jwt.sign({username: username}, 'access', {expiresIn: '1h'});
    req.session.authorization={accessToken, username};
    return res.status(200).json({message: "User successfully logged in"});
  }
  else
  return res.status(403).json({message: "Login details are invalid"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn=req.params.isbn;
  let review=req.body.review;
  console.log("Inside put review");
  console.log(req.body);
  if(req.session.authorization)
  {
    let username=req.session.authorization.username;
    if(!books[isbn])
    {
      return res.status(403).json({message: "Book not found"});
    }
    books[isbn].reviews[username]=review;
    console.log("After adding review:", books);
    res.send(JSON.stringify(books));

  }
  else
  return res.status(300).json({message: "User not logged in"});
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn=req.params.isbn;
  let review=req.body.review;
  console.log("Inside delete review");
  console.log(req.body);
  if(req.session.authorization)
  {
    let username=req.session.authorization.username;
    if(!books[isbn])
    {
      return res.status(403).json({message: "Book not found"});
    }
    delete books[isbn].reviews[username];
    console.log("After deleting review:", books);
    res.send(JSON.stringify(books));

  }
  else
  return res.status(300).json({message: "User not logged in"});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
