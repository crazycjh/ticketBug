const redis = require('redis');

// 如果有需要可以設定host 以及 port，沒設定則為預設
// const socketList = redis.createClient();
const { redisUrl } = require('./redisConfig');
const socketList =redis.createClient(redisUrl);
socketList.connect();

socketList.on('connect', async() => {
    console.log('清空 socketList')
    await socketList.flushAll();
})

exports.socketList = socketList 