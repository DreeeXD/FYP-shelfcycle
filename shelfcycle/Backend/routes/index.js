const express = require('express');

const router = express.Router();

// Controllers
const SignupUserController = require('../controller/SignupUser');
const LoginUserController = require('../controller/LoginUser');
const userDetailsController = require('../controller/userDetails');
const LogoutUser = require('../controller/LogoutUser');
const updateUser = require('../controller/updateUser');
const uploadBookController = require('../controller/uploadBook');
const getBooksController = require('../controller/getBooks');
const updateBookController = require('../controller/updateBook');

// Middleware
const authenticationToken = require('../middleware/authenticationToken');

// Routes
const messageRoutes = require('./messageRoutes');
const userRoutes = require('./userRoutes'); 
const GoogleAuthLogin = require('../controller/googleAuthLogin');
// Auth routes
router.post('/signup', SignupUserController);
router.post('/login', LoginUserController);
router.get('/user-details', authenticationToken, userDetailsController);
router.get('/logout', LogoutUser);

// User-related
router.put('/update-user', authenticationToken, updateUser);


router.post('/google-auth', GoogleAuthLogin)

// Book-related
router.post('/book-upload', authenticationToken, uploadBookController);
router.get('/get-book', getBooksController);
router.put('/book/update', authenticationToken, updateBookController);

// Chat-related
router.use('/messages', messageRoutes);

router.use('/users', userRoutes);

module.exports = router;


