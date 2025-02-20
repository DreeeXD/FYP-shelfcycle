const express = require('express')

const router = express.Router()

const SignupUserController = require('../controller/SignupUser')

router.post("/signup", SignupUserController)

module.exports = router