const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://biswaadhikarybd:1Tj3mLCkNqGNcZ3a@cluster0.biv3i.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err));

// Define a schema and model
const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  terminate: {
    type: Boolean,
    required: true,
    default: false,
  },
  pause: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Item = mongoose.model("User", UserSchema);

// Routes
// Create a new item using query params
app.get("/add-user", async (req, res) => {
  const { phone, otp, status, terminate, pause } = req.query;

  if ((!phone || !otp, !status, !terminate, !pause)) {
    return res.status(400).json({
      error: "Missing required fields: phone, otp, status, terminate, pause",
    });
  }
  try {
    const newItem = new Item({ phone, otp, status, terminate, pause });
    const savedItem = await newItem.save();
    res
      .status(201)
      .json({ message: "Item created successfully!", item: savedItem });
  } catch (error) {
    res.status(500).json({ error: "Error creating item: " + error.message });
  }
});

// Create a new item
app.post("/new-user", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all items
app.get("/users", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get an item by Phone
app.get("/user/:phone", async (req, res) => {
  try {
    const user = await Item.findOne({ phone: req.params.phone }); // Find by phone field
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a single item by ID
app.get("/user/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an item by ID
app.put("/user/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an item by ID
app.delete("/user/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
