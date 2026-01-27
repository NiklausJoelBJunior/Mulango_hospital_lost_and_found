require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn('MONGO_URI not set. Use .env or set environment variable.');
}
mongoose.connect(MONGO_URI || 'mongodb://127.0.0.1:27017/mlaf', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Simple Mongoose model for Items
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reporterName: String,
  reporterContact: String,
  image: String,
  category: String,
  location: String,
  description: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});
const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/', (req, res) => res.json({ ok: true, message: 'MLAF Backend' }));

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const data = req.body || {};

    // Map incoming fields into the Item schema
    const itemData = {
      name: data.name || data.itemName || 'Unnamed Item',
      category: data.category,
      location: data.location,
      description: data.description,
      reporterName: data.reporterName || data.yourName || '',
      reporterContact: data.reporterContact || data.contact || '',
      image: data.image || '',
    };

    const item = new Item(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
