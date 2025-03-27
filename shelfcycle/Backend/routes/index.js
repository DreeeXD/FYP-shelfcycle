const express = require('express')

const router = express.Router()

const SignupUserController = require('../controller/SignupUser')
const LoginUserController = require('../controller/LoginUser')
const userDetailsController = require('../controller/userDetails')
const authenticationToken = require('../middleware/authenticationToken')
const LogoutUser = require('../controller/LogoutUser')
const updateUser = require('../controller/updateUser')
const uploadBookController = require('../controller/uploadBook')
const getBooksController = require('../controller/getBooks')
const updateBookController = require('../controller/updateBook')

router.post("/signup", SignupUserController)
router.post("/login", LoginUserController)
router.get("/user-details", authenticationToken, userDetailsController)
router.get("/logout", LogoutUser)


router.post("/update-user", authenticationToken, updateUser)


//book upload
router.post("/book-upload", authenticationToken, uploadBookController)
router.get("/get-book", getBooksController)

router.put("/book/update", authenticationToken, updateBookController);

module.exports = router