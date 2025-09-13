require("dotenv").config();

const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

// Middleware
app.use(express.json());
app.use(cors());

// ✅ MongoDB connection (using .env)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Express app is running");
});

// ✅ Ensure upload/images directory exists
const uploadDir = path.join(__dirname, "upload/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// ✅ Serve images
app.use("/images", express.static(uploadDir));

// ✅ Upload endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
});

// ✅ Product Schema
const productSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});
const Product = mongoose.model("Product", productSchema);

// ✅ Collection Schema
const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
});
const Collection = mongoose.model("Collection", collectionSchema);

// ✅ Add Product
app.post("/addproduct", async (req, res) => {
  try {
    const products = await Product.find({});
    let newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id: newId,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error saving product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get All Products
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Signup
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  cartData: Object,
  date: { type: Date, default: Date.now },
});

app.post("/signup", async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, error: "Existing user found" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // ⚠️ Hash in production
      cartData: cart,
    });

    await user.save();
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.error("❌ Error in signup:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    const passCompare = req.body.password === user.password;
    if (!passCompare) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.error("❌ Error in login:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get latest 8 products
app.get("/newcollections", async (req, res) => {
  try {
    const newCollection = await Product.find({}).sort({ date: -1 }).limit(8);
    res.json(newCollection);
  } catch (error) {
    console.error("❌ Error fetching new collection:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Create a new collection
app.post("/addcollection", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const collection = new Collection({ name, description });
    await collection.save();
    res.json({ success: true, collection });
  } catch (error) {
    console.error("❌ Error creating collection:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get popular products in women's category
app.get("/popularinwomen", async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    res.send(popular_in_women);
  } catch (error) {
    console.error("❌ Error fetching popular products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

// ✅ Cart APIs
app.post("/addtocart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] = userData.cartData[req.body.itemId] + 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  }
  res.send("Removed");
});

app.post("/getcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// ✅ Remove Product
app.post("/removeproduct", async (req, res) => {
  try {
    const removedProduct = await Product.findOneAndDelete({ id: req.body.id });
    if (removedProduct) {
      res.json({ success: true, message: "Product removed successfully" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("❌ Error removing product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Start Server
const server = app.listen(port, () => {
  console.log(`🚀 Server is running on https://e-commarce-website-backend.onrender.com:${port}`);
});

server.on("error", (err) => {
  console.error("Error starting server:", err);
});
