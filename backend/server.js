require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware (simple)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Kas Organisasi API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/auth (register, login, me)',
      budgets: '/budgets',
      categories: '/categories',
      transactions: '/transactions',
      summary: '/summary (overall, by-budget, by-category, by-date)'
    }
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/budgets', budgetRoutes);
app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);
app.use('/summary', summaryRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Kas Organisasi Backend Server');
  console.log('='.repeat(50));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Database: ${process.env.DB_NAME}`);
  console.log(`✅ API Base URL: http://localhost:${PORT}`);
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});
