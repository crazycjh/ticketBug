const express = require('express');

const pushNotification = require('../service/scheduler/pushNotification')

const router = express.Router();

router.get('/doNotify', tmpNotification) 


function tmpNotification(req, res) {
    console.log('tmpNotification');
    pushNotification.dayliyPushNotification();

    res.status(200).json({
        status: 'success',
        data: {
            message: 'tmpNotification'
        }
    });

}
// 確認是否有推播


// router.get('/notification/getlist',authController.tokenCheck , notificationController.getList)

module.exports = router;