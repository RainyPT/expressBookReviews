const express = require('express');
const axios=require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const url="http://localhost:5000"


public_users.post("/register", (req,res) => {
  let username= req.body.username;
  let password= req.body.password;
  if(username.length<0 || password.length<0){
    res.status(400).json({message: "Invalid Credentials! Make sure to write something in both fields."});
    return;
  }
  if(!isValid(username)) {
    res.status(400).json({message: "User already registered!"});
    return;
  }

  users.push({"username":username,"password":password});
  return res.status(200).json({message: "Registered!"});

});


public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn',function (req, res) {
  let isbn=req.params['isbn'];
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author=req.params['author'];
  let bookKeys= Object.keys(books);
  let booksFiltered=[]
  bookKeys.forEach((key)=>{
    if(books[key].author===author){
      booksFiltered.push(books[key]);
    }
  })

  return res.status(200).json(booksFiltered);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title=req.params['title'];
  let bookKeys= Object.keys(books);
  let booksFiltered=[]
  bookKeys.forEach((key)=>{
    if(books[key].title===title){
      booksFiltered.push(books[key]);
    }
  })

  return res.status(200).json(booksFiltered);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn=req.params['isbn'];
  return res.status(200).json(books[isbn].reviews);
});


let GetValueAsync = async (endpoint) => {
  let data= await axios.get(url+endpoint)
  console.log(data.data)
};

var GetValue = (endpoint,value) => {
  return new Promise(function (resolve, reject) {
    axios.get(url+endpoint+value).then(function (response) {
      resolve(response.data)
    })
    .catch(function (error) {
      reject(error);
    })
  });
};


//Task 10
GetValueAsync("/")
//Task 11
GetValue("/isbn/",1).then((res)=>console.log(res));
//Task 12
GetValue("/author/","Unknown").then((res)=>console.log(res));
//Task 13
GetValue("/title/","One Thousand and One Nights").then((res)=>console.log(res));

module.exports.general = public_users;
