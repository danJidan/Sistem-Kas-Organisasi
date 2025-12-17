const express = require('express');
const router = express.Router();
const SummaryController = require('../controllers/summaryController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Routes
router.get('/', SummaryController.getOverallSummary);
router.get('/by-budget', SummaryController.getSummaryByBudget);
router.get('/by-category', SummaryController.getSummaryByCategory);
router.get('/by-date', SummaryController.getSummaryByDate);

module.exports = router;
