const redis = require('redis');

// 如果有需要可以設定host 以及 port，沒設定則為預設
const socketList = redis.createClient();
socketList.connect();

exports.socketList = socketList 