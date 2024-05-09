const redis = require("redis");
const { userNotification } = require("../../models/userNotificationModel");
const { ticketNotifyList } = require("../../models/ticketNotifyListModel");
const { Op } = require("sequelize");
const { redisUrl } = require('./redisConfig');

// cache for notification in redis
// const notificationListHandler = redis.createClient();
const publisher =redis.createClient(redisUrl);

const notificationListHandler = redis.createClient(redisUrl);
const readNotificationListHandler = redis.createClient(redisUrl);


try {
    publisher.on("connect", async () => {
        publisher.flushAll();
    })
    publisher.on("error", async (error) => {
        console.error("publisher connect error ", error);
    });

    notificationListHandler.on("connect", async () => {
        notificationListHandler.flushAll();
    });
    notificationListHandler.on("error", async (error) => {
        console.error("notificationListHandler connect error ", error);
    });
    publisher.connect();
    notificationListHandler.connect();
    console.log('redis connect success');
}catch(error) {
    console.log('publisher connect error ', error);
}
exports.publishNotification = async function (userEmail, notification) {
	// TODO 要傳遞推播數字、把推播內容寫進LIST中，先前只有傳推播內容進來
	// notification 包含 數字、推播內容{amount:1, notificationId:123456}
	try {
		const channelId = `notifications:${userEmail}`;
		console.log("publishNotification 推推", channelId, " ", notification);

		// 把通知push到redis
		notification["notification"].forEach((item) => {
			const notificationString = JSON.stringify(item);
			notificationListHandler.lPush(channelId, notificationString);
		});
		notificationListHandler.lTrim(channelId, 0, 9);

		// client點擊bell icon時才來讀取list
		// const notificationList = await notificationListHandler.lRange(channelId, 0, -1)

		await publisher.publish(
			channelId,
			JSON.stringify({ type: "NEW", message: notification["amount"] }),
		);
	} catch (error) {
		console.error(error);
	} finally {
		// console.log('publisher.quit()')
		// await publisher.quit()
		// 這裡不把publisher的連線關掉，讓所有使用者共用同一個
	}
};

// get notification from redis

// 跟notificationRedis.js的功能合併，改成每次來請求都建立一個redis連線
exports.getRedisNotification = async function (userEmail) {
	// readNotificationListHandler
	try {
		await readNotificationListHandler.connect();

		const channelId = `notifications:${userEmail}`;

		const notificationList = await readNotificationListHandler.lRange(
			channelId,
			0,
			-1,
		);
		if (notificationList.length === 0) {
			// 抓取資料庫的資料，如果為空則先塞入一個值表示尚無資料，這樣可以在下次讀取資料時不用再次到db抓取浪費效能
			let notifyList;
			const notificationIdList = await userNotification.findAll({
				attributes: ["notificationId"],
				where: { email: userEmail },
				order: [["id", "DESC"]],
				limit: 10,
				raw: true,
			});
			// 抓取 userNotification 的近10筆的notificationId 到 ticketNotifyList 中找到對應的資料
			// 組合查詢id list
			const idList = [];
			for (item of notificationIdList) {
				idList.push(item["notificationId"]);
			}
			const notificationList = await ticketNotifyList.findAll({
				attributes: { exclude: ["createDate", "id", "isPublished"] },
				where: {
					id: {
						[Op.in]: idList,
					},
				},
				raw: true,
			});
			for (item of notificationList) {
				await readNotificationListHandler.lPush(
					channelId,
					JSON.stringify(item),
				);
				// notifyList.push(channelId,JSON.stringify(item));
				notifyList = await readNotificationListHandler.lRange(
					channelId,
					0,
					-1,
				);
			}
			readNotificationListHandler.quit();
			return notifyList;
		}
		readNotificationListHandler.quit();
		return notificationList;
	} catch (error) {
		console.error("發生錯誤： ", error);
	}

	// // notificationListHandler.lTrim(channelId, 0, 9);

	// await notificationListRedis.quit();
	// console.log(notificationList);
};
