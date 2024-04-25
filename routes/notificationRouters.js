const express = require('express');

const notificationController = require('../controller/notificationController')
const authController = require('./../controller/authController');

const router = express.Router();

router.post('/updatelist',authController.tokenCheck  , notificationController.updateList)

// 確認是否有推播
router.get('/checknewnotification',authController.tokenCheck  , notificationController.checkNewNotification)

// 取得推播列表 
router.get('/getnotification', authController.tokenCheck, notificationController.getNotification)
router.get('/resetnotification', authController.tokenCheck, notificationController.resetNotification)
// router.get('/notification/getlist',authController.tokenCheck , notificationController.getList)

module.exports = router;