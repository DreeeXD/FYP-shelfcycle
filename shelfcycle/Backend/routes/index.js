const express = require('express')

const router = express.Router()

const SignupUserController = require('../controller/SignupUser')
const LoginUserController = require('../controller/LoginUser')
const userDetailsController = require('../controller/userDetails')
const authenticationToken = require('../middleware/authenticationToken')
const LogoutUser = require('../controller/LogoutUser')

router.post("/signup", SignupUserController)
router.post("/login", LoginUserController)
router.get("/user-details", authenticationToken, userDetailsController)
router.get("/logout", LogoutUser)

module.exports = router