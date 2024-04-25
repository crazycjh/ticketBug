const express = require('express');

// const userController = require('./../controllers/userController');
const authController = require('./../controller/authController');
const userController = require('../controller/userController');
const { auth } = require('google-auth-library');

const router = express.Router();

// router.post('/signup', authController.signup);
// router.post('/login', authController.login);
router.get('/logout', authController.tokenCheck, authController.logout);

// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
// router.use(authController.protect);

// router.patch('/updateMyPassword', authController.updatePassword);
// router.get('/me', userController.getMe, userController.getUser);
// router.patch('/updateMe', upload.single('photo'), userController.updateMe);
// router.delete('/deleteMe', userController.deleteMe);

// oAuth2 google 登入
router.get('/auth/google',authController.googleAuth);
router.get('/auth/google/callback',authController.googleAuthCallback);
// 這裡要加上middleware 檢查是否有token帶過來以及是否無誤
router.get('/userInfo',authController.tokenCheck ,userController.getMemberInfo);
// router.use(authController.restrictTo('admin'));

// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
