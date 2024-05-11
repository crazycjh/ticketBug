const cron = require("node-cron");
// const { ticketPrice } = require('../../')
const { ticketNotifyList } = require("../../models/ticketNotifyListModel");
const { UserFollow } = require("../../models/userfollowModel");
const { userNotification } = require("../../models/userNotificationModel");
const { UserInfo } = require("../../models/userModel");

// redis
const { socketList } = require("../redis/socketRedis");
const { publishNotification } = require("../redis/redis");

// TODO 要把全部確認完才去發送通知，而且是發送通知數量
exports.dailyPushNotification = async function () {
	// 抓取database便宜機票列表
	console.log("做推播");
	const notifyList = await ticketNotifyList.findAll({
		attributes: [
			"id",
			"createDate",
			"airport_1",
			"airport_2",
			"airport_3",
			"airport_4",
			"date_1",
			"date_2",
			"type",
			"price",
		],
		where: { isPublished: false },
		raw: true,
		// 把尚未推播的抓出來
	});

	let month_1;
	let month_2;
	const pushWaitingList = {};

	if (notifyList.length > 0) {
		for (const item of notifyList) {
			console.log("執行推播");
			month_1 = item.date_1.slice(0, 6);
			month_2 = item.date_2.slice(0, 6);
			console.log(item);
			console.log(month_1, month_2);
			if (item.type === "0") {
				// 處理來回票
				// 查詢是否有有使用者訂閱該相同出發地、目的地及月份
				const notifyUsers = await UserFollow.findAll({
					where: {
						airport_1: item.airport_1,
						airport_2: item.airport_2,
						airport_3: item.airport_3,
						airport_4: item.airport_4,
						month_1,
						month_2,
						type: item.type,
					},
					raw: true,
				});

				if (notifyUsers.length > 0) {
					// 如果有找到，就去該使用者的userNotification表寫入通知
					for (const user of notifyUsers) {
						const resp = userNotification.create({
							email: user.email,
							notificationId: item.id,
							createDate: item.createDate,
						});
						// 對該使用者設定未讀，讓離線的使用者在登入時可以抓取到這個欄位，顯示有新通知
						// UserInfo.update(
						//     {unread: false},
						//     {where: {email: user.email}}
						// )

						// 把通知推給使用者、寫入redis cache

						if (pushWaitingList[user.email]) {
							pushWaitingList[user.email]["amount"] =
								pushWaitingList[user.email]["amount"] + 1;
							pushWaitingList[user.email]["notification"].push(
								item,
							);
						} else {
							pushWaitingList[user.email] = {
								amount: 1,
								notification: [item],
							};
						}
					}
				}
				// 把被推播的entry設定為true，代表已經已經推播或是把通知寫到資料庫，等著使用者連線來抓取
				ticketNotifyList.update(
					{ isPublished: true },
					{ where: { isPublished: false } },
				);
			} else if (item.type === "1") {
				// 處理開口票
			} else {
				// 多段票
			}
		}
		Object.keys(pushWaitingList).forEach(async (email) => {
			UserInfo.update(
				{ unread: pushWaitingList[email]["amount"] },
				{ where: { email: email } },
			);

			const userIsOnline = await socketList.hGet("user_statuses", email);
			if (userIsOnline === "online") {
				console.log(email, " 發出通知數量 ： ", pushWaitingList[email]);
				publishNotification(email, pushWaitingList[email]);
			}
		});
	} else {
	}
	// console.log(notifyList);
	// 從便宜機票列表中，找出年月+地點+source，再去follow table 中找出有符合的對象。
	// 找出對象後把所有如vie, 3月出發 4月返程的都寫入db，同個source不會超過一筆，但是可能會有不同source
	// 寫完後再把該使用者比對線上使用者，如果有則發出通知(建立一個通知object 紀錄個別使用者的通知數量，以後如果有需要顯示數量時)
};

// cron.schedule('*/5 * * * * *', () => {
//     dailyPushNotification();
// });
