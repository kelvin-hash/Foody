const mongoose = require('mongoose');
const Restaurant = require('../models/Restaraunt');
const dotenv = require('dotenv');
dotenv.config();

const restaurantsData = [
     {
    name: "KFC",
    icon: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016388/restaurants/puifoue8kpir2vdvfa3i.jpg",
    cuisine: "Fast Food",
    ratings: 4.5,
    area: "Westlands",
    latitude: -1.264799,
    longitude: 36.802800
  },
  {
    name: "Dominos",
    icon: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016396/restaurants/gocyygp0pmsecwdtjksq.jpg",
    cuisine: "Pizza",
    ratings: 4.2,
    area: "Kilimani",
    latitude: -1.292315,
    longitude: 36.783070
  },
  {
    name: "Ribs",
    icon: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016406/restaurants/kw9ihld5fayk0qkfyxb5.jpg",
    cuisine: "Barbecue",
    ratings: 4.8,
    area: "CBD",
    latitude: -1.286389,
    longitude: 36.817223
  },
  {
    name: "Sushi",
    icon: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016420/restaurants/oxrvmgyn2ctboqe60xcv.jpg",
    cuisine: "Japanese",
    ratings: 4.7,
    area: "Karen",
    latitude: -1.319167,
    longitude: 36.707306
  },
  {
    name: "Milkshake",
    icon: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016428/restaurants/jryledrejnvxws1mxuil.jpg",
    cuisine: "Desserts",
    ratings: 4.3,
    area: "Lavington",
    latitude: -1.283333,
    longitude: 36.766667
  },
  {
    name: "MacDonald",
    icon: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016440/restaurants/xgt3otrwucvubtkqtyp9.jpg",
    cuisine: "Fast Food",
    ratings: 4,
    area: "Ngong Road",
    latitude: -1.300000,
    longitude: 36.783333
  },
  {
    name: "Java",
    icon: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016443/restaurants/ibs1lnxvozjjcrklenpe.jpg",
    cuisine: "Cafe",
    ratings: 4.6,
    area: "South B",
    latitude: -1.316667,
    longitude: 36.833333
  },
  {
    name: "Burger King",
    icon: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016450/restaurants/lnksmezntolgkgqfxzlb.jpg",
    cuisine: "Fast Food",
    ratings: 4.4,
    area: "Parklands",
    latitude: -1.255000,
    longitude: 36.820000
  }
];

const seedRestaurants = async () => {
    try {
        // connect to moongose 
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log("Connected to MongoDB");
        // clear existing data
        await Restaurant.deleteMany({});
        console.log("Existing restaurants cleared");
        // insert new data
        await Restaurant.insertMany(restaurantsData);
        console.log("Restaurants inserted");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding restaurants:", error);
        process.exit(1);
    }
};
seedRestaurants();
