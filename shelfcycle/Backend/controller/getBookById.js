const bookModel = require('../models/bookModel');

const getBookByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await bookModel.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Server error",
    });
  }
};

module.exports = getBookByIdController;
