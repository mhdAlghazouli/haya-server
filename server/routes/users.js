const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//create the createToken function
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "moe's secret", {
    expiresIn: maxAge,
  });
}
//handle errors
function handleError(err) {
  let errors = {
    email: "",
    userName: "",
    password: "",
    firstName: "",
    lastName: ""
  }

  if(err.code === 11000 && err.keyPattern.email){

    errors.email = "this email is already exist";
    return errors
  }else if(err.code === 11000 && err.keyPattern.userName){

    errors.userName = "this userName is already exist";
    return errors
  }else if(err.message === "User validation failed: firstName: Path `firstName` is required."){

    errors.firstName = "firstName is required";
    return errors
  }else if(err.message === "User validation failed: lastName: Path `lastName` is required."){

    errors.lastName = "lastName is required";
    return errors
  }else if(err.message === "User validation failed: userName: Path `userName` is required."){

    errors.userName = "userName is required";
    return errors
  }else if(err.message === "User validation failed: email: please enter an email"){

    errors.email = "email is required";
    return errors
  }else if(err.message === "User validation failed: password: Please enter a password"){

    errors.password = "please enter a password";
    return errors
  }else if(err.message === "User validation failed: password: Minimum password length is 6 characters"){

    errors.password = "Minimum password length is 6 characters";
    return errors
  }else if(err.message === "User validation failed: userName: Minimum userName length is 4 characters"){

    errors.userName = "Minimum userName length is 4 characters";
    return errors
  }else if(err.message === "User validation failed: email: please enter a valid email"){
    
    errors.email = "please enter a valid email"
    return errors
  }
  return errors
}

router.post('/login',  async (req, res, next) => {
  const {userName, password} = req.body;
  const user = await User.findOne({ userName: userName})
// If the user isn't found, show an error message
  if(!user){
    return res.json({status: "not ok", error :  "this userName is not exist, Please Signup."})
  }
// Compare the submitted password with the stored hashed password
  const passwordMatches = await bcrypt.compare(password, user.password);
// If the passwords don't match, show an error message
  if(!passwordMatches){
    return res.json({status: "not ok", error: "invalid password" })
  }else{
    const token = createToken(user._id)
    return res.json({status: "ok", token, user})
  }

});

//signup 
router.post('/signup', async (req, res, next) => {
  const { firstName, lastName, userName, email, password } = req.body;
 
  try {
    const user = await User.create({ firstName, lastName, userName, email, password });
    
    res.json({status: "ok", user: user})
  } catch (error) {
    console.log(error)
    const errors = handleError(error)
    res.json({status: "not ok",error: errors})
  }
    })



module.exports = router;