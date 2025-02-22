const express = require('express')

const router = express.Router()

const SignupUserController = require('../controller/SignupUser')
const LoginUserController = require('../controller/LoginUser')

router.post("/signup", SignupUserController)
router.post("/login", LoginUserController)


module.exports = router