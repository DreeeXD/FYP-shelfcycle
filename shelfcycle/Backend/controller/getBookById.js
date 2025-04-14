const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");

const getBookByIdController = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id)
      .populate("uploadedBy", "-password");

    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: "Book not found"
       });
    }

    const reviews = await reviewModel.find({ reviewedUser: book.uploadedBy._id });
    const averageRating = reviews.length
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    const bookData = book.toObject();
    bookData.uploadedBy.averageRating = averageRating;

    res.status(200).json({ 
      success: true, 
      data: bookData
     });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching book details"
     });
  }
};

module.exports = getBookByIdController;
