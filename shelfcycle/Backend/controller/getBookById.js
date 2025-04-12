const bookModel = require("../models/bookModel");

const getBookByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await bookModel
    .findById(id)
    .populate("uploadedBy", "-password");
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = getBookByIdController;
