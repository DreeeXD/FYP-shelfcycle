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
const changePassword = require('../controller/changePassword');
const getUserBooks = require('../controller/getUserBooks');
const deleteBook = require('../controller/deleteBook');
const { toggleWishlist, getUserWishlist } = require('../controller/addBookToWishlist');
const getBookByIdController = require('../controller/getBookById');
const getPublicUserProfile = require('../controller/getPublicUserProfile');
const getChatUsers = require('../controller/getChatUsers');
const searchUsers = require('../controller/searchChatUsers');
const reviewRoutes = require("./reviewRoutes");
const markBookStatus = require('../controller/markBookStatus');
const notificationRoutes = require("./notificationRoutes");
const authRoutes = require("./authRoutes");
const VerifyEmailOTP = require('../controller/verifyEmailOTP');
const { subscribe } = require('../controller/newsletterSubscriber');
const newsletterRoutes = require('./newsletterRoutes');

// Auth routes
router.post('/signup', SignupUserController);
router.post('/login', LoginUserController);
router.get('/user-details', authenticationToken, userDetailsController);
router.get('/logout', LogoutUser);
router.post('/verify-otp', VerifyEmailOTP);

// User-related
router.put('/update-user', authenticationToken, updateUser);
router.post('/change-password', authenticationToken, changePassword);

router.get('/user/:userID', getPublicUserProfile)

router.post('/google-auth', GoogleAuthLogin)

// Book-related
router.post('/book-upload', authenticationToken, uploadBookController);
router.get('/get-book', getBooksController);
router.put('/book/update', authenticationToken, updateBookController);
router.put('/book/update/:id', authenticationToken, updateBookController);
router.get('/my-uploads', authenticationToken, getUserBooks);
router.delete('/book/:id', authenticationToken, deleteBook);
router.get('/book/:id', getBookByIdController);
router.put("/book/:id/mark", authenticationToken, markBookStatus);


// Chat-related
router.use('/messages', messageRoutes);
router.get('/chat-users', authenticationToken, getChatUsers);
router.get('/search-users', authenticationToken, searchUsers);

router.use('/users', userRoutes);

//wishlist related
router.get('/wishlist', authenticationToken, getUserWishlist);
router.post('/wishlist', authenticationToken, toggleWishlist);

router.use("/notifications", notificationRoutes);

router.use("/newsletter", newsletterRoutes);


router.use("/auth", authRoutes);

//review related
router.use("/reviews", reviewRoutes);

module.exports = router;
