const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); // Make sure path is correct

async function authenticationToken(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login.",
        error: true,
        success: false,
      });
    }

    jwt.verify(token, process.env.Secret_Token_Key, async (error, decoded) => {
      if (error || !decoded?._id) {
        console.log("JWT verification error:", error);
        return res.status(401).json({
          message: "Invalid or expired token.",
          error: true,
          success: false,
        });
      }

      // Fetch user from DB
      try {
        const user = await userModel.findById(decoded._id).select("_id username email");

        if (!user) {
          return res.status(401).json({
            message: "User not found.",
            error: true,
            success: false,
          });
        }

        req.user = user; // Attach full user to request
        next();

      } catch (dbErr) {
        console.error("Error fetching user from DB:", dbErr);
        return res.status(500).json({
          message: "Internal server error while validating user.",
          error: true,
          success: false,
        });
      }
    });

  } catch (err) {
    console.error("Unexpected auth middleware error:", err);
    res.status(500).json({
      message: "Authentication failed.",
      error: true,
      success: false,
    });
  }
}

module.exports = authenticationToken;
