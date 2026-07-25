const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'notevault-dev-secret-change-me';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const NODE_ENV = process.env.NODE_ENV || 'development';

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      name: name.trim(),
      theme: 'dark'
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name, theme: user.theme }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    setTokenCookie(res, token);

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name, theme: user.theme }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: NODE_ENV === 'production', sameSite: 'lax' });
  res.json({ success: true, message: 'Logged out' });
};

exports.getMe = (req, res) => {
  res.json({
    success: true,
    token: req.token,
    user: { id: req.user._id, email: req.user.email, name: req.user.name, theme: req.user.theme }
  });
};


exports.updateTheme = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { theme: req.body.theme });
    res.json({ success: true, theme: req.body.theme });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update theme' });
  }
};
