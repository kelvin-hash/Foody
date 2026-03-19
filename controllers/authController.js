const User = require('../models/User');
const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');

// create register controller function
const register = async (req,res)=>{
    try {
        // get data from the request body
        const{name,email,password} =req.body;
        // check if all the fields are provided
        if (!name ||!email ||!password) {
            return res.status(400).json({
                message:"Please fill all the fields"
            });
        }
        // if all fields are provided continue to check if the user exists to avoid doubel registration.
        // we are using email since it unique fo each user
        const userExists = await User.findOne({email});
        // if the user exists return a rejection message
        if (userExists) {
            return res.status(400).json({
                message:"User already exists"
            });
        }
        // Hash the password to store it when creating a new user
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password,salt);
        // Create a new user
        const user =await User.create(
            {
                name,email,password:hashedpass
            }
        );
        // genetate a user token
        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );
        // return a success message and the token to the clients
        return res.status(201).json({
            message:"User registered succesfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });
    } catch (error) {
        return res.status(501).json({
            message:"server error",
            error:error.message
        });
    }
};

// Controller function to handle login
const login = async (req,res)=>{
    try {
        // take the clients details from the request body
        const { email, password } = req.body;
        // check if the client supplied all the needed details
        if (!email || !password) {
            return res.status(400).json({
                message: "please provide email and password"
            });
        }
        // now lets check if the user actually exists
        const user = await User.findOne({ email });
        // if the user does not exist send a error respaonse
        if (!user) {
            return res.status(400).json({
                message: "invalid credentials"
            });
        }
        // now we proceed to validate the password
        const isPassValid = await bcrypt.compare(password, user.password);
        // if the password is wrong return a error message
        if (!isPassValid) {
            return res.status(400).json({
                message: "invalid credentials"
            });
        }
        // generate a token for the logged in user
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        // return the token and confirmation message to the user
        return res.status(200).json({
            message: "login succesfull",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(201).json({
            message: "server error",
            error: error.message
        });
    }
};
module.exports = {register,login};