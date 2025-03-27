const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  bookTitle: {
    type: String,
    required: true,
    trim: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookAuthor: {
    type: String,
    required: true,
    trim: true,
  },
  bookDescription: {
    type: String,
    required: true,
    trim: true,
  },
  bookCondition: {
    type: String,
    required: true,
    trim: true,
  },
  bookCategory: {
    type: String,
    required: true,
    trim: true,
  },
  bookType: {
    type: String,
    enum: ['sell', 'exchange'],
    required: true,
  },
  bookPrice: {
    type: Number,
    default: null, // Price is only required if type is "sell"
  },
  bookImage: {
    type: [String],
    default: [],
  }
}, {
  timestamps: true,
});

const bookModel = mongoose.model('Book', bookSchema);

module.exports = bookModel;
