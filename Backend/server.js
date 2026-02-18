require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Configure CORS to allow the official Netlify frontend and local development
const allowedOrigins = [
  'https://mulagolostandfound.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps) or if it's in the allowed list
    if(!origin || allowedOrigins.indexOf(origin) !== -1 || origin === '*') {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: This origin is not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage config for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mlaf_items',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    access_mode: 'public',
    type: 'upload',
  },
});

const upload = multer({ storage: storage });

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
  claims: [
    {
      name: String,
      contact: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
      // Detailed ownership verification fields
      itemDescription: String,
      color: String,
      brand: String,
      whenLost: String,
      whereLost: String,
      distinguishingFeatures: String,
      matchPercentage: { type: Number, default: 0 },
    }
  ],
  claimedBy: String,
  claimedContact: String,
  claimedAt: { type: Date },
  lastAction: {
    action: String,
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    adminUsername: String,
    timestamp: Date,
  },
}, { timestamps: true });
const Item = mongoose.model('Item', itemSchema);

// Admin model
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Admin = mongoose.model('Admin', adminSchema);

// Lost Item Report model (submitted by users who lost something)
const lostReportSchema = new mongoose.Schema({
  reporterName: { type: String, required: true },
  reporterContact: { type: String, required: true },
  itemName: { type: String, required: true },
  category: String,
  description: String,
  color: String,
  brand: String,
  location: String,
  dateLost: String,
  distinguishingFeatures: String,
  status: { type: String, default: 'open' }, // open, matched, resolved
  matchedItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  matchPercentage: { type: Number, default: 0 },
}, { timestamps: true });
const LostReport = mongoose.model('LostReport', lostReportSchema);

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

app.post('/items', upload.single('image'), async (req, res) => {
  try {
    const data = req.body || {};
    let imageUrl = data.image || '';

    // If a file was uploaded via multer, use that URL
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    // Map incoming fields into the Item schema
    const itemData = {
      name: data.name || data.itemName || 'Unnamed Item',
      category: data.category,
      location: data.location,
      description: data.description,
      reporterName: data.reporterName || data.yourName || '',
      reporterContact: data.reporterContact || data.contact || '',
      image: imageUrl,
    };

    const item = new Item(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating item:', err);
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
    const allowed = ['status', 'name', 'category', 'location', 'description', 'image', 'claimedBy', 'claimedContact', 'claimedAt'];
    allowed.forEach((k) => { if (k in updates) item[k] = updates[k]; });

    // If item is being marked as claimed, we set the collection timestamp
    if (updates.status === 'claimed') {
        item.claimedAt = new Date();
    }

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

// Delete item
app.delete('/items/:id', verifyAdmin, async (req, res) => {
  console.log(`[DELETE] Attempting to delete item: ${req.params.id}`);
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      console.log(`[DELETE] Item not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Item not found' });
    }
    console.log(`[DELETE] Successfully deleted item: ${req.params.id}`);
    res.json({ ok: true, message: 'Item deleted successfully' });
  } catch (err) {
    console.error(`[DELETE] Error deleting item ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
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

// Helper: calculate match percentage between a claim/report and a found item
function calculateMatchPercentage(claimData, item) {
  let score = 0;
  let maxScore = 0;

  // Category match (weight: 20)
  maxScore += 20;
  if (claimData.category && item.category) {
    if (claimData.category.toLowerCase() === item.category.toLowerCase()) score += 20;
  }

  // Color match (weight: 15)
  maxScore += 15;
  if (claimData.color && item.description) {
    if (item.description.toLowerCase().includes(claimData.color.toLowerCase()) ||
        item.name?.toLowerCase().includes(claimData.color.toLowerCase())) {
      score += 15;
    }
  }

  // Brand match (weight: 15)
  maxScore += 15;
  if (claimData.brand && (item.description || item.name)) {
    const combined = `${item.name} ${item.description}`.toLowerCase();
    if (combined.includes(claimData.brand.toLowerCase())) score += 15;
  }

  // Location match (weight: 15)
  maxScore += 15;
  if (claimData.whereLost && item.location) {
    if (item.location.toLowerCase().includes(claimData.whereLost.toLowerCase()) ||
        claimData.whereLost.toLowerCase().includes(item.location.toLowerCase())) {
      score += 15;
    }
  }

  // Description keyword match (weight: 20)
  maxScore += 20;
  if (claimData.itemDescription && item.description) {
    const claimWords = claimData.itemDescription.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const itemDesc = `${item.name} ${item.description}`.toLowerCase();
    const matchedWords = claimWords.filter(w => itemDesc.includes(w));
    if (claimWords.length > 0) {
      score += Math.round((matchedWords.length / claimWords.length) * 20);
    }
  }

  // Distinguishing features match (weight: 15)
  maxScore += 15;
  if (claimData.distinguishingFeatures && item.description) {
    const featureWords = claimData.distinguishingFeatures.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const itemDesc = `${item.name} ${item.description}`.toLowerCase();
    const matchedFeatures = featureWords.filter(w => itemDesc.includes(w));
    if (featureWords.length > 0) {
      score += Math.round((matchedFeatures.length / featureWords.length) * 15);
    }
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

// Record a claim for an item (public endpoint) - Enhanced with detailed fields
app.post('/items/:id/claims', async (req, res) => {
  try {
    const { fullName, contact, note, itemDescription, color, brand, whenLost, whereLost, distinguishingFeatures } = req.body || {};
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Calculate match percentage
    const claimData = { itemDescription, color, brand, whereLost, distinguishingFeatures, category: item.category };
    const matchPct = calculateMatchPercentage(claimData, item);

    const claim = {
      name: fullName || 'Anonymous',
      contact: contact || '',
      note: note || '',
      itemDescription: itemDescription || '',
      color: color || '',
      brand: brand || '',
      whenLost: whenLost || '',
      whereLost: whereLost || '',
      distinguishingFeatures: distinguishingFeatures || '',
      matchPercentage: matchPct,
    };
    item.claims = item.claims || [];
    item.claims.push(claim);

    // Also record an audit entry for traceability (no admin)
    item.audits = item.audits || [];
    item.audits.push({ adminId: null, adminUsername: 'public', action: 'claim', timestamp: new Date(), note: `Claim by ${claim.name} (Match: ${matchPct}%)` });

    item.lastAction = { action: 'claim', adminId: null, adminUsername: 'public', timestamp: new Date() };

    await item.save();
    res.status(201).json({ ok: true, claim: item.claims[item.claims.length - 1] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lost Item Reports - PUBLIC endpoint to submit a report
app.post('/lost-reports', async (req, res) => {
  try {
    const data = req.body || {};
    const report = new LostReport({
      reporterName: data.reporterName || 'Anonymous',
      reporterContact: data.reporterContact || '',
      itemName: data.itemName || 'Unknown Item',
      category: data.category || '',
      description: data.description || '',
      color: data.color || '',
      brand: data.brand || '',
      location: data.location || '',
      dateLost: data.dateLost || '',
      distinguishingFeatures: data.distinguishingFeatures || '',
    });
    await report.save();

    // Auto-match against existing found items
    const foundItems = await Item.find({ status: 'approved' });
    let bestMatch = null;
    let bestPct = 0;
    for (const item of foundItems) {
      const pct = calculateMatchPercentage({
        itemDescription: data.description,
        color: data.color,
        brand: data.brand,
        whereLost: data.location,
        distinguishingFeatures: data.distinguishingFeatures,
        category: data.category,
      }, item);
      if (pct > bestPct) {
        bestPct = pct;
        bestMatch = item;
      }
    }

    if (bestMatch && bestPct >= 30) {
      report.matchedItemId = bestMatch._id;
      report.matchPercentage = bestPct;
      await report.save();
    }

    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all lost reports (admin only)
app.get('/lost-reports', verifyAdmin, async (req, res) => {
  try {
    const reports = await LostReport.find().sort({ createdAt: -1 }).limit(500);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update lost report status (admin only)
app.patch('/lost-reports/:id', verifyAdmin, async (req, res) => {
  try {
    const updates = req.body || {};
    const report = await LostReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const allowed = ['status', 'matchedItemId', 'matchPercentage'];
    allowed.forEach(k => { if (k in updates) report[k] = updates[k]; });

    await report.save();
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete lost report (admin only)
app.delete('/lost-reports/:id', verifyAdmin, async (req, res) => {
  try {
    const report = await LostReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ ok: true, message: 'Lost report deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Match a specific lost report against all found items (admin endpoint)
app.get('/lost-reports/:id/matches', verifyAdmin, async (req, res) => {
  try {
    const report = await LostReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const foundItems = await Item.find({ status: { $in: ['approved', 'pending'] } });
    const matches = foundItems.map(item => {
      const pct = calculateMatchPercentage({
        itemDescription: report.description,
        color: report.color,
        brand: report.brand,
        whereLost: report.location,
        distinguishingFeatures: report.distinguishingFeatures,
        category: report.category,
      }, item);
      return { item, matchPercentage: pct };
    })
    .filter(m => m.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 10);

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
