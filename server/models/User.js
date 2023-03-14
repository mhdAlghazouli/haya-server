const mongoose = require('mongoose');
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const usersSchema= new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    unique: true,
    required: true,
    minlength: [4, "Minimum userName length is 4 characters"]
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    validate: [isEmail, "please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  }
  
}, { timestamps: true })

// Use pre middleware hook to hash the password before saving it to the database
usersSchema.pre('save', async function (next)  {
  // If the password hasn't been modified, move on to the next middleware
  if(!this.isModified('password')) {
    return next();
  }
  // Generate a salt value with 10 rounds of salt generation
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the salt
  const hashedPassword = await bcrypt.hash(this.password, salt);

  // Replace the plain text password with the hashed password
  this.password = hashedPassword;

  // Move on to the next middleware
  return next();
})

// Create a User model with the schema
module.exports =  mongoose.model('User', usersSchema);