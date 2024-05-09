const { extractFlightInfo } = require("../controller/handleRawDate");
const { CityToAirportCode } = require("../controller/airPortCode");
const { ticketPrice } = require("../models/ticketPriceModel");
const { createNotifyList } = require("../utility/notification/useNotification");

let adultNum = 1;

let currentDate;
currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以加1
const day = String(currentDate.getDate()).padStart(2, "0");
let currentDateString = `${year}${month}${day}`;

exports.roundTripCrawler = async (cities, dateTable, page) => {
	// 傳入cities
	let [fromCity, toCity] = cities;

	for (const date of dateTable) {
		let from = {
			fromYear: date.startY,
			fromMonth: date.startM,
			fromDay: date.startD
		};
		let to = {
			toYear: date.endY,
			toMonth: date.endM,
			toDay: date.endD
		};
		let fromC = fromCity.city;
		let fromCountry = fromCity.country;
		let fromCode = fromCity.code;

		for (const item of toCity) {
			let toC = item.city;
			let toCountry = item.country;
			let toCode = item.code;
			const url = `https://www.expedia.com.tw/Flights-Search?flight-type=on&mode=search&trip=roundtrip&langid=1033&leg1=from:${fromC}, ${fromCountry} (${fromCode}),to:${toC},${toCountry}(${toCode}),departure:${from.fromYear}/${from.fromMonth}/${from.fromDay}TANYT&leg2=from:${toC}, ${toCountry} (${toCode}),to:${fromC}, ${fromCountry} (${fromCode}),departure:${to.toYear}/${to.toMonth}/${to.toDay}TANYT&options=cabinclass:economy&fromDate=${from.fromYear}/${from.fromMonth}/${from.fromDay}&toDate=${to.toYear}/${to.toMonth}/${to.toDay}&d1=${from.fromYear}-${from.fromMonth}-${from.fromDay}&d2=${to.toYear}-${to.toMonth}-${to.toDay}&passengers=adults:${adultNum},infantinlap:N`;
			const extractInfo = [];
      console.log('doCrawller');
			const [rawInfo] = await doCrawler(page, url);

			try {
				const travelDate = {
					fromYear: from.fromYear,
					toYear: to.toYear,
					fromMonth: from.fromMonth,
					fromDay: from.fromDay,
					toMonth: to.toMonth,
					toDay: to.toDay
				};

				if (rawInfo) {
					rawInfo.forEach((rawItem) => {
						// 提取 Expedia 機票資訊
						const info = extractFlightInfo(rawItem, travelDate);
						if (info) {
							extractInfo.push(info);
						}
					});
					// 寫回csv

					if (extractInfo.length > 0) {
						console.log(extractInfo[0]);
						// if(type==="OpenJaw"){
						//   dest = [fromCode.split("-")[0], toCode.split("-")[0], toTwoCode.split("-")[0]];
						// }else {
						//   dest = [fromCode.split("-")[0], toCode.split("-")[0]];
						// }

						// writeToCSV(extractInfo, dest, travelDate);

						console.log("dododododod-----");

						console.log(extractInfo[0].layoverInfo);
						try {
							let airport_1;
							let airport_2;
							let airport_3;
							let airport_4;
							let date_1;
							let date_2;
							let price;
							let source;

							for (const item of extractInfo) {
                console.log(item);
								airport_1 = CityToAirportCode(
									item.departureLocation
								);
								airport_2 = CityToAirportCode(
									item.arrivalLocation
								);
								airport_3 = CityToAirportCode(
									item.arrivalLocation
								);
								airport_4 = CityToAirportCode(
									item.departureLocation
								);
								date_1 = item.fromDate;
								date_2 = item.toDate;
								price = item.price;
								source = "Expedia";
								const resp = await ticketPrice.create({
									createDate: currentDateString,
									airport_1,
									airport_2,
									airport_3,
									airport_4,
									num: 4,
									type: 0,
									date_1,
									date_2,
									date_3: "",
									date_4: "",
									price,
									source,
									layover_info: item.layoverInfo
								});
							}
							// 取出extractInfo 裡面的第一筆資料寫進tickNotifyList table
							//
							const params = {
								airport: [
									airport_1,
									airport_2,
									airport_3,
									airport_4
								],
								currentDateString,
								type: "0",
								date: [date_1, date_2],
								price,
								source
							};

              // 建立推播列表 create notifyList table
							createNotifyList(params);
						} catch (error) {
							console.error(error);
						}
						// console.log('寫入');
						// console.log(resp);
					}

					// console.log(extractInfo);
					await page.waitForTimeout(1000 + Math.random() * 5000);
				}
			} catch (error) {
				console.log(error, " 寫入發生錯誤");
			}
		}
	}
};

exports.openJawCrawler = async (cities, dateTable, page) => {
  let [fromCity, toCity, endCity] = cities;
  console.log(cities);
  console.log(dateTable);
  for (const date of dateTable) {
    let from = {
			fromYear: date.startY,
			fromMonth: date.startM,
			fromDay: date.startD
		};
		let to = {
			toYear: date.endY,
			toMonth: date.endM,
			toDay: date.endD
		};


    let fromC = fromCity.city;
    let fromCountry = fromCity.country;
    let fromCode = fromCity.code;

    let end = endCity.city;
    let endCountry = endCity.country;
    let endCode = endCity.code;

    for (const item of toCity) {
      let toC = item[0].city;
      let toCountry = item[0].country;
      let toCode = item[0].code;
      let toTwo = item[1].city;
      let toTwoCountry = item[1].country;
      let toTwoCode = item[1].code;
      
      const url = `https://www.expedia.com.tw/Flights-Search?flight-type=on&mode=search&langid=1033&trip=multi&leg1=from:${fromC}, ${fromCountry} (${fromCode}),to:${toC},${toCountry}(${toCode}),departure:${from.fromYear}/${from.fromMonth}/${from.fromDay}TANYT&leg2=from:${toTwo},${toTwoCountry}(${toTwoCode}),to:${end}, ${endCountry} (${endCode}),departure:${to.toYear}/${to.toMonth}/${to.toDay}TANYT&options=cabinclass:economy&fromDate=${from.fromYear}/${from.fromMonth}/${from.fromDay}&d1=${to.toYear}-${to.toMonth}-${to.toDay}&passengers=adults:1,infantinlap:N`;
      console.log(url);
      const [rawInfo] = await doCrawler(page, url);
      const extractInfo = [];

      try {
        console.log(rawInfo.length);
        if (rawInfo) {
          const travelDate = {
            fromYear: from.fromYear,
            toYear: to.toYear,
            fromMonth: from.fromMonth,
            fromDay: from.fromDay,
            toMonth: to.toMonth,
            toDay: to.toDay
          };
          if(rawInfo) {
            rawInfo.forEach((rawItem) => {
              // 提取 Expedia 機票資訊
              const info = extractFlightInfo(rawItem, travelDate);
              if (info) {
                extractInfo.push(info);
              }
            });

          }

          if(extractInfo.length > 0) {
            try {
							let airport_1;
							let airport_2;
							let airport_3;
							let airport_4;
							let date_1;
							let date_2;
							let price;
							let source;

							for (const item of extractInfo) {
								airport_1 = CityToAirportCode(
									item.departureLocation
								);
								airport_2 = CityToAirportCode(
									item.arrivalLocation
								);
                console.log(toTwoCode);
								airport_3 = CityToAirportCode(toTwo);
                // airport_3 = CityToAirportCode(
								// 	item.arrivalLocation
								// );
								airport_4 = CityToAirportCode(
									item.departureLocation
								);
								date_1 = item.fromDate;
								date_2 = item.toDate;
								price = item.price;
								source = "Expedia";
								const resp = await ticketPrice.create({
									createDate: currentDateString,
									airport_1,
									airport_2,
									airport_3,
									airport_4,
									num: 4,
									type: "1",
									date_1,
									date_2,
									date_3: "",
									date_4: "",
									price,
									source,
									layover_info: item.layoverInfo
								});
							}
							// 取出extractInfo 裡面的第一筆資料寫進tickNotifyList table
							//
							const params = {
								airport: [
									airport_1,
									airport_2,
									airport_3,
									airport_4
								],
								currentDateString,
								type: "1",
								date: [date_1, date_2],
								price,
								source
							};

              // 建立推播列表 create notifyList table
							createNotifyList(params);
						} catch (error) {
							console.error(error);
						}
						// console.log('寫入');
						// console.log(resp);
					}

					// console.log(extractInfo);
					await page.waitForTimeout(1000 + Math.random() * 5000);
          }
        }
          // 寫回csv
          // console.log(extractInfo);
          // if (extractInfo.length > 0) {
          //   if (type === "OpenJaw") {
          //     dest = [
          //       fromCode.split("-")[0],
          //       toCode.split("-")[0],
          //       toTwoCode.split("-")[0],
          //       endCode.split("-")[0]
          //     ];
          //   } else {
          //     dest = [
          //       fromCode.split("-")[0],
          //       toCode.split("-")[0]
          //     ];
          //   }
          //   console.log(dest);
          //   writeToCSV(extractInfo, dest, travelDate);

          //   // console.log(extractInfo);
          //   await page.waitForTimeout(
          //     1000 + Math.random() * 5000
          //   );
          // }
        // }
      // } 
      catch (error) {
        console.log(error, " 寫入發生錯誤");
      }
    }
  }
};
async function doCrawler(page, url) {
	// const page = await browser.newPage();
	console.log("doCrawler  ----------------");
	try {
		await page.goto(url, { waitUntil: "load" });

		await page.waitForSelector(".uitk-card-link");

		const extractInfo = [];
		const rawInfo = await page.$$eval(".uitk-card-link", (elements) =>
			elements
				.slice(0, 3)
				.map((el) => el.querySelector("span:first-child").textContent)
		);
		// console.log('rawInfo*****************------------------------------*****************');
		// console.log(rawInfo);

		return [rawInfo];
	} catch (error) {
		console.log("發生錯誤拉 ", error);
		return [];
	}
};