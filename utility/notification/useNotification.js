const { ticketNotifyList } = require("../../models/ticketNotifyListModel");

exports.createNotifyList = async function (params) {
	console.log("建立NotifyList");
	const resp = await ticketNotifyList.create({
		createDate: params.currentDateString,
		airport_1: params.airport[0],
		airport_2: params.airport[1],
		airport_3: params.airport[2],
		airport_4: params.airport[3],
		type: params.type,
		date_1: params.date[0],
		date_2: params.date[1],
		price: params.price,
		source: params.source,
		isPublished: false
	});
};
