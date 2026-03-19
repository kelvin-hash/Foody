
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req,res,next)=>{
    try {
        // check if the request header contains the token
        const authHeader = req.headers.authorization;
        // if the token does not exist return an error message
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Not authorized, no token'
            });
        }
        // extract the header from the header
        const token = authHeader.split(' ')[1];
        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // find the user fromthe decode token
        const user = await User.findById(decoded.id).select('-password');
        // if the user is not found send back a error message
        if (!user) {
            return res.status(401).json({
                message: 'Not authorized, user not found'
            });
        }
        // attach the user to the request object
        req.user = user;
        next(); 
    } catch (error) {
        res.status(401).json({
            message: 'Not authorized, invalid token'
        });
    }
    
};
module.exports={protect};