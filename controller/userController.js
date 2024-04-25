const { UserInfo } = require('../models/userModel');
const { UserFollow } = require('../models/userfollowModel');

exports.getMemberInfo = async(req, res) => {
    // 取得帳號名稱、綁定的平台、推播列表 這要有兩張表
    let userInfo;
    let notificationList;
    try{
        userInfo = await UserInfo.findOne({attributes: ['email', 'google', 'notify'], where: { email : req.user }});
        if(!userInfo) {
            userInfo = []
        }
        // 下面的代碼是取得用戶的推播列表。
        notificationList = await UserFollow.findAll({attributes:{exclude: ['email']}, where: { email : req.user } });
        if(!notificationList) {
            notificationList=[];
        }
    }catch(error){
        console.error('資料庫讀取錯誤 ', error);
        res.status(400).json({
            status: 'error',
            message: '資料庫讀取錯誤'
        });
        return;
    }

    res.status(200).json({
        status: 'success',
        data: {
            userInfo,
            notificationList
        }
    });
    return;
}