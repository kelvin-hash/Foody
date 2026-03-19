const mongoose = require("mongoose");
const Restaurant = require("../models/Restaraunt");
const Menu = require("../models/menuItem");
require("dotenv").config();

const menus = [
  { restaurantName: "KFC", name: "Original Recipe Chicken", description: "Crispy fried chicken with KFC's secret spices", price: 850, category: "Main", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016463/menus/wlr8ys6yi35yazoud0vy.jpg" },
  { restaurantName: "KFC", name: "Zinger Burger", description: "Spicy chicken fillet with lettuce and mayo", price: 650, category: "Burger", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016477/menus/lqzrkgbnjlrrvvvj2k9b.jpg" },

  { restaurantName: "Dominos", name: "Pepperoni Pizza", description: "Classic pepperoni with mozzarella cheese", price: 1200, category: "Pizza", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016496/menus/sz8qu51xbclebkp7sml2.jpg" },
  { restaurantName: "Dominos", name: "BBQ Chicken Pizza", description: "BBQ sauce, grilled chicken & onions", price: 1350, category: "Pizza", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016514/menus/jeaeh0ytnxqn5ppbqj5r.jpg" },

  { restaurantName: "Ribs", name: "Smoked Beef Ribs", description: "Slow-cooked ribs with smoky BBQ sauce", price: 1800, category: "Main", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016536/menus/ie7ubxdbdumtknkbmyo5.jpg" },
  { restaurantName: "Ribs", name: "Grilled Sausages", description: "Juicy sausages served with fries", price: 950, category: "Main", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016551/menus/lyxtciryd4wptwojdju0.jpg" },

  { restaurantName: "Sushi", name: "Salmon Sushi Roll", description: "Fresh salmon with rice and seaweed", price: 1400, category: "Sushi", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016563/menus/wvnpdyhhhgrp7nhtwmg4.jpg" },
  { restaurantName: "Sushi", name: "Tempura Prawns", description: "Crispy battered prawns with dip", price: 1100, category: "Starter", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016592/menus/xtt5zw4u3lym7owqjt1z.jpg" },

  { restaurantName: "Milkshake", name: "Chocolate Milkshake", description: "Rich chocolate blended with creamy milk", price: 450, category: "Drink", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016602/menus/cods9aszwgj8wvc5b8ta.jpg" },
  { restaurantName: "Milkshake", name: "Vanilla Milkshake", description: "Classic vanilla ice cream shake", price: 400, category: "Drink", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016609/menus/re9lancdrvfmnx1ovl9y.jpg" },

  { restaurantName: "MacDonald", name: "Big Mac", description: "Double beef burger with special sauce", price: 700, category: "Burger", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016620/menus/ymxmku7ds2xcyzkphurb.jpg" },
  { restaurantName: "MacDonald", name: "Fries", description: "Golden crispy french fries", price: 300, category: "Sides", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016628/menus/ezyzraypz9h3t7eqfxsj.jpg" },

  { restaurantName: "Java", name: "Cappuccino", description: "Espresso with steamed milk foam", price: 350, category: "Coffee", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016650/menus/gwjylvfzxr1yqozlrnxn.jpg" },
  { restaurantName: "Java", name: "Blueberry Muffin", description: "Soft muffin filled with blueberries", price: 280, category: "Bakery", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016659/menus/wkmqhefjg3mkoffvvkiv.jpg" },

  { restaurantName: "Burger King", name: "Whopper", description: "Flame-grilled beef burger", price: 800, category: "Burger", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016669/menus/us7zdighnpzwjckky0pc.jpg" },
  { restaurantName: "Burger King", name: "Onion Rings", description: "Crispy battered onion rings", price: 350, category: "Sides", image: "https://res.cloudinary.com/dcwgmshgv/image/upload/v1772016678/menus/fsrqr70jfwaebdddpdym.jpg" }
];

const seedMenus = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI);

    await Menu.deleteMany();

    const restaurants = await Restaurant.find();

    // Map name -> _id
    const restaurantMap = {};
    restaurants.forEach(r => {
      restaurantMap[r.name] = r._id;
    });

    const formattedMenus = menus.map(menu => ({
      restaurant: restaurantMap[menu.restaurantName],
      name: menu.name,
      description: menu.description,
      price: menu.price,
      category: menu.category,
      image: menu.image
    }));

    await Menu.insertMany(formattedMenus);

    console.log("✅ Menus seeded successfully");
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedMenus();