const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

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
const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", ItemSchema);

// Routes

// Create a new item using request body
app.post("/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new item using query params
app.get("/create-item", async (req, res) => {
  const { name, data } = req.query;

  if (!name || !data) {
    return res
      .status(400)
      .json({ error: "Missing required fields (name, data)" });
  }

  try {
    const newItem = new Item({ name, data });
    const savedItem = await newItem.save();
    res
      .status(201)
      .json({ message: "Item created successfully!", item: savedItem });
  } catch (error) {
    res.status(500).json({ error: "Error creating item: " + error.message });
  }
});

// Read all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a single item by ID
app.get("/item/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an item by ID
app.put("/item/:id", async (req, res) => {
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
app.delete("/item/:id", async (req, res) => {
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
