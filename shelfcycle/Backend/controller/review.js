const Review = require("../models/reviewModel");

exports.getReviewsByUserId = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate("reviewer", "username uploadPic");
    res.status(200).json({ 
        success: true, 
        data: reviews
     });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        success: false,
         message: "Failed to fetch reviews"
         });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("reviewer");
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewedUser = req.params.userId;
    const reviewer = req.user._id;

    const review = new Review({ 
        rating, 
        comment, 
        reviewedUser, 
        reviewer
     });

    await review.save();
    res.status(201).json({ 
        success: true,
         message: "Review added successfully"
         });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        success: false, 
        message: "Failed to submit review"
     });
  }
};
