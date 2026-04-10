// .env to help in loading environment variables from .env file
const dotenv = require('dotenv');
// load environment variables from .env file
dotenv.config();
//the worker that will process the mpesa payment callbacks
require("./workers/processPayment");
// the express framework to create the server and handle routes
const express = require('express');
// mongoose to help with db connection
const mongoose =require('mongoose');
// cors to help in cross orign requests
const cors = require('cors');
// import the authentication route
const authRoute = require("./routes/authRoutes");
// import the order route
const orderRoute = require("./routes/order");
// import the mpesa callback route
const mpesaRoute = require("./routes/mpesaRoute");
// import the order status route
const orderStatusRoute = require("./routes/orderStatusRoute");
// import the stripe webhook route
const stripeWebhook = require("./routes/stripeWebhook");
// import the restaurant routea for providing restaurant data to the frontend
const restaurantRoute = require("./routes/restaurant");
// call the express function to create a sever instance
const app = express();
// Mongoose db connection
mongoose.connect(process.env.MONGOOSE_URI)
    .then(()=>console.log("succesully connected to the db"))
    .catch((error)=>console.log('error occurred while connecting:',error));

//MIDDLEWARE
// use cors to allow cross-origin requests
app.use(cors({
  origin: [
    "https://foody-frontend-4i7t.onrender.com",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
//because stripe sends webhook events as raw json we need to use express.raw middleware for the stripe webhook route
app.use('/api/stripe',stripeWebhook);
// use express.json to parse incoming JSON requests
app.use(express.json());

// ROUTES
app.use('/api/auth',authRoute);
app.use('/api/orders',orderRoute);
app.use('/api/mpesa',mpesaRoute);
app.use('/api/restaurants',restaurantRoute);
app.use('/api/status',orderStatusRoute);


// test route to check if the server is running
app.get('/',(req,res) =>{
    res.json({message:"Welcome to the foody server!"});
});
// define the port
const PORT = process.env.PORT ||5000;
// listen on the defined port
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


