const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if(users.find((user)=> user.username===username)){
    return false;
  }
  return true;
}

const authenticatedUser = (username, password) => { 
  if (users.find((user) => user.username === username && user.password === password)) {
    return true;
  }
  else {
    return false;
  }

}


regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username.length < 0 || password.length < 0) {
    return res.status(400).json({ message: "Invalid Credentials! Make sure to write something in both fields." });
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, "fingerprint_customer", { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "Logged in!" });
  }
  else {
    return res.status(400).json({ message: "User not found!" });
  }

});


regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn=req.params['isbn'];
  books[isbn].reviews[req.session.authorization.username]= {"review":req.body.review};
  return res.status(200).json({message:"Review modified/created!"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn=req.params['isbn'];

  if(books[isbn].reviews[req.session.authorization.username]){
    delete books[isbn].reviews[req.session.authorization.username]
    return res.status(200).json({message:"Review deleted!"})
  }
  return res.status(400).json({message:"Review not found!"})
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
