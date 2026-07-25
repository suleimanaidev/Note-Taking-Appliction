const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'notevault-dev-secret-change-me';

const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HTTP-only cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Check Authorization Bearer header (for Postman / API clients / Header-based JWT auth)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated. JWT token missing.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Session expired, please login again' : 'Invalid or expired JWT token';
    return res.status(401).json({ success: false, message: msg });
  }
};

module.exports = protect;

