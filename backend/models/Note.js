const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [50000, 'Content cannot exceed 50,000 characters']
    },
    category: {
      type: String,
      enum: ['Personal', 'Work', 'Study', 'Ideas', 'Shopping', 'Travel', 'Health', 'Finance'],
      default: 'Personal'
    },
    color: {
      type: String,
      default: '#e8a849'
    },
    pinned: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

noteSchema.index({ user: 1, isDeleted: 1, pinned: -1, createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
