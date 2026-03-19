// import mongoose
const mongoose=require('mongoose');
// create the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match:[/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    select:false
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  googleId: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});
// 
// Create model from schema
const User=mongoose.model('User',userSchema);
module.exports=User;