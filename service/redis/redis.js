const redis = require('redis');

const publisher = redis.createClient();
// cache for notification in redis
const notificationListHandler = redis.createClient();

publisher.connect();
notificationListHandler.connect();

exports.publishNotification = async function(userEmail, notification) {
    try {
        const channelId = `notifications:${userEmail}`;
        console.log('publishNotification ',channelId);
        

        const notificationString = JSON.stringify(notification);
    
        // 把通知push到redis
        notificationListHandler.lPush(channelId, notificationString);
        notificationListHandler.lTrim(channelId, 0, 9);

        // client點擊bell icon時才來讀取list
        // const notificationList = await notificationListHandler.lRange(channelId, 0, -1)
        console.log('publisher execute');
        console.log(notification);
        
        await publisher.publish(channelId, JSON.stringify({type:'new',message: 'newNotification'}));
    }catch(error) {
        console.error(error);
    }finally {
        // console.log('publisher.quit()')
        // await publisher.quit()
        // 這裡不把publisher的連線關掉，讓所有使用者共用同一個
    }

}

// get notification from redis
exports.getRedisNotification = async function(userEmail) {
    const notificationList = await notificationListHandler.lRange(channelId, 0, -1);
    return notificationList;
}