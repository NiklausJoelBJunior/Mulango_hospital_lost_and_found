require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// After successful connection, ensure an initial admin exists if env vars provided
mongoose.connection.on('connected', async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const adminUser = process.env.ADMIN_USER;
      const adminPass = process.env.ADMIN_PASS;
      if (adminUser && adminPass) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(adminPass, salt);
        const admin = new Admin({ username: adminUser, passwordHash: hash });
        await admin.save();
        console.log(`Initial admin created: ${adminUser}`);
      } else {
        console.log('No admin exists and ADMIN_USER/ADMIN_PASS not provided.');
      }
    }
  } catch (err) {
    console.error('Error ensuring initial admin:', err);
  }
});

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
  audits: [
    {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      adminUsername: String,
      action: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
    }
  ],
  lastAction: {
    action: String,
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    adminUsername: String,
    timestamp: Date,
  },
  createdAt: { type: Date, default: Date.now },
});
const Item = mongoose.model('Item', itemSchema);

// Admin model
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Admin = mongoose.model('Admin', adminSchema);

// Helper to sign JWT
const signToken = (admin) => {
  const payload = { id: admin._id, username: admin.username };
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
  return jwt.sign(payload, secret, { expiresIn: '8h' });
};

// Auth middleware
const verifyAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
    const payload = jwt.verify(token, secret);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

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

// Update item (approve/reject or patch fields)
app.patch('/items/:id', verifyAdmin, async (req, res) => {
  try {
    const updates = req.body || {};

    // Perform the update
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Apply updates to allowed fields
    const allowed = ['status', 'name', 'category', 'location', 'description', 'image'];
    allowed.forEach((k) => { if (k in updates) item[k] = updates[k]; });

    // Record audit entry if admin performed an action (status change or note)
    if (req.admin && (updates.status || updates.note)) {
      const adminId = req.admin.id;
      const adminUsername = req.admin.username;
      const action = updates.status ? updates.status : 'update';
      const audit = {
        adminId,
        adminUsername,
        action,
        timestamp: new Date(),
        note: updates.note || '',
      };
      item.audits = item.audits || [];
      item.audits.push(audit);
      item.lastAction = { action: audit.action, adminId, adminUsername, timestamp: audit.timestamp };
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protected admin-only route to fetch pending items
app.get('/admin/items', verifyAdmin, async (req, res) => {
  try {
    const items = await Item.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(500);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin registration - allowed only if no admin exists
app.post('/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const existing = await Admin.findOne({});
    if (existing) return res.status(403).json({ error: 'Admin already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const admin = new Admin({ username, passwordHash: hash });
    await admin.save();
    const token = signToken(admin);
    res.status(201).json({ admin: { id: admin._id, username: admin.username }, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin login
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(admin);
    res.json({ admin: { id: admin._id, username: admin.username }, token });
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
