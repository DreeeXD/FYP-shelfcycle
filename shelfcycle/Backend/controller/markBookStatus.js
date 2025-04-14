const Book = require("../models/bookModel");

const markBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookStatus, isExchanged } = req.body;

    const book = await Book.findByIdAndUpdate(id, {
      bookStatus,
      isExchanged
    }, { new: true });

    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    res.status(200).json({ 
        success: true, 
        message: "Book updated", 
        data: book
     });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        success: false, 
        message: "Update failed"
     });
  }
};

module.exports = markBookStatus;