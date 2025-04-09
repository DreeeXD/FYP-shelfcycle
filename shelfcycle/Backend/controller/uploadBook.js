const bookModel = require('../models/bookModel'); // ✅ This must be at the top

const uploadBookController = async (req, res) => {
  try {
    const { bookType, bookPrice, ...rest } = req.body;

    const uploadedBy = req.user?._id;
    if (!uploadedBy) {
      return res.status(401).json({
        message: "Unauthorized. User not logged in.",
        success: false,
        error: true,
      });
    }

    const finalBookData = {
      ...rest,
      uploadedBy,
      bookType,
      bookPrice: bookType === 'sell' ? bookPrice : null,
    };

    const uploadBook = new bookModel(finalBookData);
    const savedBook = await uploadBook.save();

    res.status(201).json({
      data: savedBook,
      success: true,
      error: false,
      message: "Book uploaded successfully!",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = uploadBookController;
