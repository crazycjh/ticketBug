const redis = require('redis');

// 如果有需要可以設定host 以及 port，沒設定則為預設
const subscriber = redis.createClient();
subscriber.connect();

subscriber.on('connect', async() => {
    console.log('清空subscriber')
    subscriber.flushAll();
})

exports.subscriber = subscriber