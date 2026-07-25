const Note = require('../models/Note');

const formatNote = (n) => ({
  _id: n._id,
  title: n.title,
  content: n.content,
  category: n.category,
  color: n.color,
  pinned: n.pinned,
  isDeleted: n.isDeleted,
  deletedAt: n.deletedAt,
  createdAt: n.createdAt,
  updatedAt: n.updatedAt
});

exports.getNotes = async (req, res) => {
  try {
    const { search, category, sort = 'newest', page = 1, limit = 20 } = req.query;
    const filter = { user: req.user._id, isDeleted: false };

    if (category) filter.category = category;

    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [
        { title: regex },
        { content: regex },
        { category: regex }
      ];
    }

    const sortOption = { pinned: -1 };
    if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'oldest') sortOption.createdAt = 1;
    else if (sort === 'alphabetical') sortOption.title = 1;
    else sortOption.createdAt = -1;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [notes, total] = await Promise.all([
      Note.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Note.countDocuments(filter)
    ]);

    res.json({
      success: true,
      notes: notes.map(formatNote),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notes' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content, category, color, pinned } = req.body;
    const note = await Note.create({
      user: req.user._id,
      title: title.trim(),
      content: content.trim(),
      category: category || 'Personal',
      color: color || '#e8a849',
      pinned: pinned || false
    });

    res.status(201).json({ success: true, note: formatNote(note) });
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ success: false, message: 'Failed to create note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content, category, color, pinned } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isDeleted: false },
      {
        title: title.trim(),
        content: content.trim(),
        category,
        color,
        pinned: pinned || false
      },
      { new: true }
    );

    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    res.json({ success: true, note: formatNote(note) });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ success: false, message: 'Failed to update note' });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id, isDeleted: false });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    note.pinned = !note.pinned;
    await note.save();

    res.json({ success: true, note: formatNote(note), message: note.pinned ? 'Note pinned' : 'Note unpinned' });
  } catch (err) {
    console.error('Toggle pin error:', err);
    res.status(500).json({ success: false, message: 'Failed to toggle pin' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    res.json({ success: true, message: 'Note moved to trash' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete note' });
  }
};

exports.getTrash = async (req, res) => {
  try {
    const trashed = await Note.find({ user: req.user._id, isDeleted: true }).sort({ deletedAt: -1 });
    res.json({ success: true, notes: trashed.map(formatNote) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch trash' });
  }
};

exports.emptyTrash = async (req, res) => {
  try {
    await Note.deleteMany({ user: req.user._id, isDeleted: true });
    res.json({ success: true, message: 'Trash emptied' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to empty trash' });
  }
};

exports.restoreNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!note) return res.status(404).json({ success: false, message: 'Note not found in trash' });

    res.json({ success: true, note: formatNote(note), message: 'Note restored' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to restore note' });
  }
};

exports.permanentDeleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id, isDeleted: true });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found in trash' });

    res.json({ success: true, message: 'Note permanently deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to permanently delete note' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [totalNotes, pinnedNotes, trashedNotes, categories] = await Promise.all([
      Note.countDocuments({ user: userId, isDeleted: false }),
      Note.countDocuments({ user: userId, isDeleted: false, pinned: true }),
      Note.countDocuments({ user: userId, isDeleted: true }),
      Note.aggregate([
        { $match: { user: userId, isDeleted: false } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    const categoryCounts = {};
    categories.forEach(c => { categoryCounts[c._id] = c.count; });

    res.json({
      success: true,
      stats: {
        totalNotes,
        pinnedNotes,
        trashedNotes,
        categoryCounts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get stats' });
  }
};

exports.exportNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    const exportData = notes.map(formatNote);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="notevault-backup.json"');
    res.json(exportData);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to export notes' });
  }
};

