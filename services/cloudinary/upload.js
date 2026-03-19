// backend/services/cloudinary/upload.js
require('dotenv').config();
const path = require("path");
const fs = require("fs");
const cloudinary = require("../../config/cloudinary");

const ASSETS_FOLDER = path.resolve(__dirname, "../../../frontend/src/assets");
const MENU_FILE = path.resolve(__dirname, "../../../frontend/src/data/menu.js");
const RESTAURANT_FILE = path.resolve(__dirname, "../../../frontend/src/data/restaurant.js");

const uploadImage = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    console.log(`Uploaded: ${filePath} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
  }
};

// Matches exact order in restaurant.js
const restaurantFiles = [
  { id: 1, name: "KFC",         file: "KFC.jpg",        cuisine: "Fast Food", ratings: 4.5, distance: "2.5 km" },
  { id: 2, name: "Dominos",     file: "Dominos.jpg",    cuisine: "Pizza",     ratings: 4.2, distance: "3.0 km" },
  { id: 3, name: "Ribs",        file: "Ribs.jpg",       cuisine: "Barbecue",  ratings: 4.8, distance: "4.0 km" },
  { id: 4, name: "Sushi",       file: "Sushi.jpg",      cuisine: "Japanese",  ratings: 4.7, distance: "5.0 km" },
  { id: 5, name: "Milkshake",   file: "Milkshake.jpg",  cuisine: "Desserts",  ratings: 4.3, distance: "1.5 km" },
  { id: 6, name: "MacDonald",   file: "MacDonald.jpg",  cuisine: "Fast Food", ratings: 4.0, distance: "2.0 km" },
  { id: 7, name: "Java",        file: "Java.jpg",       cuisine: "Cafe",      ratings: 4.6, distance: "3.5 km" },
  { id: 8, name: "Burger King", file: "BurgerKing.jpg", cuisine: "Fast Food", ratings: 4.4, distance: "2.8 km" },
];

// Matches exact order in menu.js
const menuFiles = [
  { id: 101, restaurantId: 1, name: "Original Recipe Chicken", file: "chicken.jpg",           description: "Crispy fried chicken with KFC's secret spices", price: 850,  category: "Main"    },
  { id: 102, restaurantId: 1, name: "Zinger Burger",           file: "zinger.jpg",            description: "Spicy chicken fillet with lettuce and mayo",    price: 650,  category: "Burger"  },
  { id: 201, restaurantId: 2, name: "Pepperoni Pizza",         file: "pepperoni.jpg",         description: "Classic pepperoni with mozzarella cheese",       price: 1200, category: "Pizza"   },
  { id: 202, restaurantId: 2, name: "BBQ Chicken Pizza",       file: "bbqpizza.jpg",          description: "BBQ sauce, grilled chicken & onions",            price: 1350, category: "Pizza"   },
  { id: 301, restaurantId: 3, name: "Smoked Beef Ribs",        file: "smokkedribs.jpg",       description: "Slow-cooked ribs with smoky BBQ sauce",          price: 1800, category: "Main"    },
  { id: 302, restaurantId: 3, name: "Grilled Sausages",        file: "sausages.jpg",          description: "Juicy sausages served with fries",               price: 950,  category: "Main"    },
  { id: 401, restaurantId: 4, name: "Salmon Sushi Roll",       file: "sushiRoll.jpg",         description: "Fresh salmon with rice and seaweed",             price: 1400, category: "Sushi"   },
  { id: 402, restaurantId: 4, name: "Tempura Prawns",          file: "prawns.jpg",            description: "Crispy battered prawns with dip",                price: 1100, category: "Starter" },
  { id: 501, restaurantId: 5, name: "Chocolate Milkshake",     file: "choclatemilkshake.jpg", description: "Rich chocolate blended with creamy milk",        price: 450,  category: "Drink"   },
  { id: 502, restaurantId: 5, name: "Vanilla Milkshake",       file: "vanillaMilkshake.jpg",  description: "Classic vanilla ice cream shake",                price: 400,  category: "Drink"   },
  { id: 601, restaurantId: 6, name: "Big Mac",                 file: "bigmac.jpg",            description: "Double beef burger with special sauce",          price: 700,  category: "Burger"  },
  { id: 602, restaurantId: 6, name: "Fries",                   file: "fries.jpg",             description: "Golden crispy french fries",                     price: 300,  category: "Sides"   },
  { id: 701, restaurantId: 7, name: "Cappuccino",              file: "cappuccino.jpg",        description: "Espresso with steamed milk foam",                price: 350,  category: "Coffee"  },
  { id: 702, restaurantId: 7, name: "Blueberry Muffin",        file: "muffins.jpg",           description: "Soft muffin filled with blueberries",            price: 280,  category: "Bakery"  },
  { id: 801, restaurantId: 8, name: "Whopper",                 file: "whooper.jpg",           description: "Flame-grilled beef burger",                      price: 800,  category: "Burger"  },
  { id: 802, restaurantId: 8, name: "Onion Rings",             file: "onionrings.jpg",        description: "Crispy battered onion rings",                    price: 350,  category: "Sides"   },
];

const main = async () => {
  try {
    // Upload restaurant images
    console.log("\n📤 Uploading restaurant images...");
    const restaurantURLMap = {};
    for (const { name, file } of restaurantFiles) {
      const url = await uploadImage(path.join(ASSETS_FOLDER, file), "restaurants");
      if (url) restaurantURLMap[name] = url;
    }

    // Upload menu images
    console.log("\n📤 Uploading menu images...");
    const menuURLMap = {};
    for (const { name, file } of menuFiles) {
      const url = await uploadImage(path.join(ASSETS_FOLDER, file), "menus");
      if (url) menuURLMap[name] = url;
    }

    // Rewrite restaurant.js
    const restaurantContent = `export const restaurants = [
${restaurantFiles.map(({ id, name, cuisine, ratings, distance }) => `  {
    id: ${id},
    name: "${name}",
    icon: "${restaurantURLMap[name] || ""}",
    cuisine: "${cuisine}",
    ratings: ${ratings},
    distance: "${distance}",
  }`).join(",\n")}
];
`;

    // Rewrite menu.js
    const menuContent = `export const menus = [
${menuFiles.map(({ id, restaurantId, name, description, price, category }) => `  {
    id: ${id},
    restaurantId: ${restaurantId},
    name: "${name}",
    description: "${description}",
    price: ${price},
    category: "${category}",
    image: "${menuURLMap[name] || ""}",
  }`).join(",\n")}
];
`;

    fs.writeFileSync(RESTAURANT_FILE, restaurantContent, "utf8");
    console.log("\n✅ restaurant.js updated with Cloudinary URLs!");

    fs.writeFileSync(MENU_FILE, menuContent, "utf8");
    console.log("✅ menu.js updated with Cloudinary URLs!");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

main();