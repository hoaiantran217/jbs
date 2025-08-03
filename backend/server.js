require('dotenv').config();

// Set fallback JWT_SECRET if not in environment
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fallback-jwt-secret-key-for-development';
  console.log('⚠️ JWT_SECRET not found in environment, using fallback key');
}

// Import Console Manager
const consoleManager = require('./utils/consoleManager');

// Tùy chọn chặn console output
// Bỏ comment dòng dưới để chặn tất cả console output
// consoleManager.disableAll();

// Hoặc chặn theo level cụ thể:
// consoleManager.disableInfoAndWarn(); // Chặn info và warn
// consoleManager.disableErrors(); // Chặn chỉ error
// consoleManager.disableAllExceptError(); // Chặn tất cả trừ error
// consoleManager.disableAllExceptLog(); // Chặn tất cả trừ log

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Import auto maturity checker
const { startAutoMaturityChecker } = require('./utils/autoMaturityChecker');

const app = express();

// Middleware - CORS với origin cụ thể
app.use(cors({
  origin: [
    'http://www.jbsinv.com', // Frontend User (HTTP)
    'https://www.jbsinv.com', // Frontend User (HTTPS)
    'https://jbs-invest-jrst.vercel.app',  // Admin CMS
    'https://jbs-invest-s3dg.vercel.app',  // Frontend User
    'https://jbs-invest.vercel.app',       // Frontend User (alternative)
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST' && req.path.includes('upload')) {
    console.log('Upload request detected');
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get('/', (req, res) => {
  res.send('Zuna Invest Backend API');
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

app.post('/api/test', (req, res) => {
  res.json({ message: 'POST API is working!', data: req.body });
});

// Test CORS endpoint
app.post('/api/test-cors', (req, res) => {
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  res.json({ 
    message: 'CORS test successful!', 
    data: req.body,
    origin: req.headers.origin,
    timestamp: new Date().toISOString() 
  });
});

// Test JWT endpoint
app.get('/api/test-jwt', (req, res) => {
  const jwt = require('jsonwebtoken');
  const testPayload = { id: 'test-user-id', role: 'user' };
  
  try {
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      message: 'JWT test successful',
      jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
      token: token,
      decoded: decoded,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'JWT test failed',
      error: error.message,
      jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set'
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/packages', require('./routes/investmentPackage'));
app.use('/api/transactions', require('./routes/transaction'));
app.use('/api/posts', require('./routes/post'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/investments', require('./routes/investment'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/bank-info', require('./routes/bankInfo'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/team-members', require('./routes/teamMember'));
app.use('/api/investment-data', require('./routes/investmentData'));
app.use('/api/identity-verification', require('./routes/identityVerification'));
app.use('/api/withdrawal-notifications', require('./routes/withdrawalNotification'));
app.use('/api/transaction-notifications', require('./routes/transactionNotification'));
app.use('/api/security-config', require('./routes/securityConfig'));
app.use('/api/referral-transactions', require('./routes/referralTransaction'));
app.use('/api/promotion', require('./routes/promotion'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Start auto maturity checker after database connection
  startAutoMaturityChecker();
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
  }).on('error', (err) => {
    console.error('❌ Server error:', err);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
