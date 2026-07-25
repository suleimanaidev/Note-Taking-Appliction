const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const protect = require('../middleware/authMiddleware');
const { register, login, logout, getMe, updateTheme } = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many auth attempts, please try again later' }
});

router.post('/register', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
], validate, register);

router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], validate, login);

router.post('/logout', logout);
router.get('/me', protect, getMe);

router.put('/theme', protect, [
  body('theme').isIn(['dark', 'light']).withMessage('Invalid theme')
], validate, updateTheme);

module.exports = router;
