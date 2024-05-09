const redis = require('redis');
const {redisUrl} = require('./redisConfig');
const notificationListRedis = redis.createClient(redisUrl);

async function readNotificationList(email) {
    try{
        await notificationListRedis.connect();

        const channelId = `notifications:${email}`;
        const notificationList = await notificationListRedis.lRange(channelId, 0, -1);
        if(notificationList.length === 0){
            // 抓取資料庫的資料，如果為空則先塞入一個值表示尚無資料，這樣可以在下次讀取資料時不用再次到db抓取浪費效能
        }
        // notificationListHandler.lTrim(channelId, 0, 9);

        await notificationListRedis.quit();
        console.log(notificationList);
        // res.status(200).send
    }catch(error) {

    }
}

async function checkRedisList(email) {
    //check if the list exist
    await notificationListRedis.connect();
    const channelId = `notifications:${email}`;
    const exist = await notificationListRedis.exists(channelId);

    if(!exist) {
        // TODO 撈出推播列表寫入Redis list 
    }
    await notificationListRedis.quit();
}

module.exports = {
    checkRedisList,
    readNotificationList
}