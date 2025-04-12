const Wishlist = require("../models/wishlistModel");
const Book = require("../models/bookModel");
const Notification = require("../models/notificationModel");

const toggleWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const existing = await Wishlist.findOne({ user: userId, book: bookId });

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        message: "Removed from wishlist",
        wishlisted: false,
      });
    }

    const book = await Book.findById(bookId).populate("uploadedBy");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const newWishlist = new Wishlist({ user: userId, book: bookId });
    await newWishlist.save();

    //Send notification to book owner if not self
    if (String(book.uploadedBy._id) !== String(userId)) {
      await Notification.create({
        recipient: book.uploadedBy._id,
        message: `Your book "${book.bookTitle}" was added to someone's wishlist.`,
        link: `/book-details/${book._id}`,
      });
      console.log("📬 Sending notification to:", book.uploadedBy._id);
    }

    return res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlisted: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getUserWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user._id }).populate("book");
    res.status(200).json({ success: true, data: wishlistItems });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get wishlist" });
  }
};

module.exports = {
  toggleWishlist,
  getUserWishlist, 
};
