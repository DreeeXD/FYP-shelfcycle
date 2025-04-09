const bookModel = require('../models/bookModel');

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const book = await bookModel.findOne({ _id: bookId, uploadedBy: userId });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found or not authorized to delete',
        success: false,
        error: true,
      });
    }

    await bookModel.findByIdAndDelete(bookId);

    res.json({
      message: 'Book deleted successfully',
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to delete book',
      success: false,
      error: true,
    });
  }
};

module.exports = deleteBook;