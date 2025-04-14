const express = require("express");
const router = express.Router();
const { getReviewsByUserId, addReview } = require("../controller/review");
const authenticationToken = require("../middleware/authenticationToken");

router.get("/:userId", getReviewsByUserId);
router.post("/:userId", authenticationToken, addReview);

module.exports = router;
