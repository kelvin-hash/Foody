const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require("cloudinary");

// configure the cloudinary
cloudinary.v2.config(
{
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}
);

module.exports = cloudinary.v2;