const { UserFollow } = require('../models/userfollowModel');
const { UserInfo } = require('../models/userModel')
const { getRedisNotification } = require('../service/redis/redis');

// 訂閱列表
exports.updateList = async(req, res) => {
    // 接收email, airport 1-4, type month1,2
    // 會有兩個array ，1. 刪除的部分 2. 新增的部分
    let errorFlag = false
    if(req.body.add.length){
        try{
            for(item of req.body.add) {
                delete item.id;
                item['email'] = req.user
                await UserFollow.create(item);
            }
        }catch(error){
            errorFlag = true;
        }

        // UserInfo.create({ email:email, google:true})
    }
    
    if(req.body.delete.length){
        try{
            for(item of req.body.delete) {
                await UserFollow.destroy({where:{id:item.id}});
            }
        }catch(error) {
            errorFlag = true;
        }
    }
    if(errorFlag) {
        res.status(202).send({ message: `更新中途發生錯誤` });
        return;
    }else {
        res.status(200).send({ message: `更新完成` });
    }
    
}

exports.checkNewNotification = async(req, res) => {
    
    const result = await UserInfo.findOne({attributes:['unread'],where:{email: req.user}, raw:true})
    // 回傳有幾筆未看的通知
    // TODO 要在發出通知同時也在資料庫中紀錄有幾筆未看
    console.log('unread ',result.unread);
    res.status(200).send(result)
}

exports.getNotification = async(req, res) => {
    const notificationList = await getRedisNotification(req.user);
    res.status(200).json({
        data:notificationList
    });
}

exports.resetNotification = async(req, res) => {
    // 更新  unread 為0
    UserInfo.update(
        {unread: 0},
        {where: {email: req.user}}
    )
    res.status(200).send({ message: `清空成功` });
}

exports.getList = (req, res) => {
    // 可能不需要
    // 以token取得使用者資料

}