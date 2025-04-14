const express = require("express");
const ForgotPassword = require("../controller/forgotPassword");
const ResetPassword = require("../controller/resetPassword");

const router = express.Router();

router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:token", ResetPassword);

module.exports = router;
