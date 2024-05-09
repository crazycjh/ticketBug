const redis = require("redis");

// 如果有需要可以設定host 以及 port，沒設定則為預設
// const subscriber = redis.createClient();
const {redisUrl} = require("./redisConfig");
const subscriber = redis.createClient(redisUrl);

try {
	subscriber.on("connect", async () => {
		console.log("清空subscriber");
		subscriber.flushAll();
	});
	subscriber.on("error", async (error) => {
		console.log("error ", error);
	});

	subscriber.connect();
} catch (error) {
	console.log("subscriber connect error ", error);
}

exports.subscriber = subscriber;
