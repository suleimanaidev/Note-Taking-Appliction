const express = require('express');
const { body, query, param } = require('express-validator');
const validate = require('../middleware/validate');
const protect = require('../middleware/authMiddleware');
const {
  getNotes,
  createNote,
  updateNote,
  togglePin,
  deleteNote,
  getTrash,
  emptyTrash,
  restoreNote,
  permanentDeleteNote,
  getStats,
  exportNotes
} = require('../controllers/noteController');

const router = express.Router();

const noteValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required (max 200 chars)'),
  body('content').trim().isLength({ min: 1, max: 50000 }).withMessage('Content is required'),
  body('category').isIn(['Personal','Work','Study','Ideas','Shopping','Travel','Health','Finance']).withMessage('Invalid category'),
  body('color').isIn(['#e8a849','#4ecdc4','#ff6b6b','#95e1d3','#fce38a','#ff8b94','#a8d8ea','#ffd3b6']).withMessage('Invalid color'),
  body('pinned').optional().isBoolean()
];

router.use(protect);

router.get('/', [
  query('search').optional().trim().isLength({ max: 200 }),
  query('category').optional().isIn(['Personal','Work','Study','Ideas','Shopping','Travel','Health','Finance']),
  query('sort').optional().isIn(['newest','oldest','alphabetical']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], validate, getNotes);

router.post('/', noteValidation, validate, createNote);

router.get('/stats', getStats);
router.get('/export', exportNotes);
router.get('/trash', getTrash);
router.delete('/trash/empty', emptyTrash);

router.post('/trash/:id/restore', [
  param('id').isMongoId().withMessage('Invalid note ID')
], validate, restoreNote);

router.delete('/trash/:id', [
  param('id').isMongoId().withMessage('Invalid note ID')
], validate, permanentDeleteNote);

router.patch('/:id/pin', [
  param('id').isMongoId().withMessage('Invalid note ID')
], validate, togglePin);

router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid note ID'),
  ...noteValidation
], validate, updateNote);

router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid note ID')
], validate, deleteNote);

module.exports = router;

