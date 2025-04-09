const Wishlist = require("../models/wishlistModel");

const toggleWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const existing = await Wishlist.findOne({ user: userId, book: bookId });

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id);
      return res.status(200).json({ success: true, message: "Removed from wishlist", wishlisted: false });
    }

    const newWishlist = new Wishlist({ user: userId, book: bookId });
    await newWishlist.save();

    return res.status(201).json({ success: true, message: "Added to wishlist", wishlisted: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
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

module.exports = { toggleWishlist, getUserWishlist };
