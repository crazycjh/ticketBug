const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const chromium = require('chromium');

const { extractFlightInfo }  = require("./handleRawDate");
const { writeToCSV } = require("./writeToCSV");



puppeteer.use(StealthPlugin());

// const intervalD = intervalDate(3,6);
// console.log(intervalD);
// 區間(去回星期固定)、固定間隔 N 天一路平移到設定的天數
// type : interval, sequence
// 同點進出  (要可以選擇去回機場)
// 不同點進出 (要可以選擇去回機場) 台北到歐洲多點、亞洲多點到歐洲多點(還要搭配日期)，是要哪種作法？
// 
exports.crawler = async (dateTable, type, cities=[]) => {
  // 啟動瀏覽器，可選擇開啟或關閉無頭模式
  let browser;
  try {
    browser = await puppeteer.launch({
      // executablePath:
      //   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // 替换为你的 Chrome 可执行文件的路径
      executablePath: chromium.path,
      args: ['--no-sandbox']
      // headless:'new', // 根据需要设置为 true 或 false
      // executablePath:executablePath(),
    });
  }catch (error) {
    console.log('puppeteer 出事拉',error);
  }
  


  
  let from  = 'Taipei';
  let fromCountry = 'Taiwan';
  let fromCode = 'TPE-Taoyuan Intl.'
  let fromYear = '2024'
  let fromMonth = '04'
  let fromDay = '09'

  let to = '';
  let toCountry = '';
  let toCode = '';
  let toYear = '2024'
  let toMonth = '04'
  let toDay = '24'

  let toTwo = '';
  let toTwoCountry = '';
  let toTwoCode = '';
  let end = '';
  let endCountry = '';
  let endCode = '';
  

  let adultNum = 1;
  let urlList = [];
  let destCodeList = [];
  
  const page = await browser.newPage();

  // await page.goto(`https://www.expedia.com.tw`,{waitUntil: 'load'});
  
  // const cookies = await page.cookies();
  // const expediaCookie = cookies.find((cookie)=>  cookie.name === 'CRQS')
  
  // if( expediaCookie ) {
  //   expediaCookie.value = 't|62`s|62`l|en_US`c|TWD';
  // }

  // // 設定語言
  // await page.setExtraHTTPHeaders({
  //   'Accept-Language': 'en-US,en;q=0.9'
  // });

  // await page.waitForTimeout(500);
  // console.log('expediaCookie : ===== ', expediaCookie);

 // 寫一個可以處理date的function
 

  // const destinations = [{to:'Prague', toCountry:'Czechia', toCode:'PRG-Vaclav Havel'}, {to:'Vienna', toCountry:'Austria', toCode:'VIE-Vienna Intl.'}, {to:'Munich', toCountry:'Germany', toCode:'MUC-All Airports'}];

  // const destinations = [{to:'Prague', toCountry:'Czechia', toCode:'PRG-Vaclav Havel', toTwo:'Budapest', toTwoCountry:'Hungary', toTwoCode:'BUD-Ferenc Liszt Intl.'}];
  if(type==="RoundTrip"){
    let [fromCity, toCity] = cities;

    for (const date of dateTable){
        fromYear = date.startY;
        fromMonth = date.startM;
        fromDay = date.startD; 
        toYear = date.endY;
        toMonth = date.endM;
        toDay = date.endD;
        
        from = fromCity.city;
        fromCountry = fromCity.country;
        fromCode = fromCity.code;
        for (item of toCity) {
          to = item.city;
          toCountry = item.country;
          toCode = item.code;
          const url = `https://www.expedia.com.tw/Flights-Search?flight-type=on&mode=search&trip=roundtrip&langid=1033&leg1=from:${from}, ${fromCountry} (${fromCode}),to:${to},${ toCountry }(${toCode}),departure:${fromYear}/${fromMonth}/${fromDay}TANYT&leg2=from:${to}, ${toCountry} (${toCode}),to:${from}, ${fromCountry} (${fromCode}),departure:${toYear}/${toMonth}/${toDay}TANYT&options=cabinclass:economy&fromDate=${fromYear}/${fromMonth}/${fromDay}&toDate=${toYear}/${toMonth}/${toDay}&d1=${fromYear}-${fromMonth}-${fromDay}&d2=${toYear}-${toMonth}-${toDay}&passengers=adults:${adultNum},infantinlap:N`
          const extractInfo = []
          
          const [rawInfo] = await doCrawler(page ,url)

          try {
            const travelDate = {fromYear, toYear, fromMonth, fromDay, toMonth, toDay}
            if(rawInfo) {
              rawInfo.forEach((rawItem)=> {
                // 提取 Expedia 機票資訊
                const info = extractFlightInfo(rawItem, travelDate);
                if(info){
                  extractInfo.push(info);  
                }
                
              })
              // 寫回csv
              
              
              if(type==="OpenJaw"){
                dest = [fromCode.split("-")[0], toCode.split("-")[0], toTwoCode.split("-")[0]];
              }else {
                dest = [fromCode.split("-")[0], toCode.split("-")[0]];
              }
  
              writeToCSV(extractInfo, dest, travelDate);
              
              // console.log(extractInfo);   
              await page.waitForTimeout(1000 + Math.random() *5000);
            }
  
          }catch (error) {
            console.log(error, ' 寫入發生錯誤')
          }
        }
       
    }
    
    
    
  }else if (type==="OpenJaw") {
    let [fromCity, toCity, endCity] = cities;

    for (const date of dateTable){
      fromYear = date.startY;
      fromMonth = date.startM;
      fromDay = date.startD; 
      toYear = date.endY;
      toMonth = date.endM;
      toDay = date.endD;
      
      from = fromCity.city;
      fromCountry = fromCity.country;
      fromCode = fromCity.code;
      
      end = endCity.city;
      endCountry = endCity.country;
      endCode = endCity.code;
      
      
    
      for(item of toCity) {
        to = item[0].city;
        toCountry = item[0].country;
        toCode = item[0].code;
        toTwo = item[1].city;
        toTwoCountry = item[1].country;
        toTwoCode = item[1].code;
        
        const url = `https://www.expedia.com.tw/Flights-Search?flight-type=on&mode=search&langid=1033&trip=multi&leg1=from:${from}, ${fromCountry} (${fromCode}),to:${to},${ toCountry }(${toCode}),departure:${fromYear}/${fromMonth}/${fromDay}TANYT&leg2=from:${toTwo},${ toTwoCountry }(${toTwoCode}),to:${end}, ${endCountry} (${endCode}),departure:${toYear}/${toMonth}/${toDay}TANYT&options=cabinclass:economy&fromDate=${fromYear}/${fromMonth}/${fromDay}&d1=${toYear}-${toMonth}-${toDay}&passengers=adults:1,infantinlap:N`

        
        const [rawInfo] = await doCrawler(page ,url)
        const extractInfo = [];
        let info = false;
        try {
          if(rawInfo) {
            const travelDate = {fromYear, toYear, fromMonth, fromDay, toMonth, toDay}
            rawInfo.forEach((rawItem)=> {
              // 提取 Expedia 機票資訊
              info = extractFlightInfo(rawItem, travelDate);
              if(info){
                extractInfo.push(info);  
              }
            })
            // 寫回csv
            console.log(extractInfo)
            if(extractInfo.length > 0) {
              if(type==="OpenJaw"){
                dest = [fromCode.split("-")[0], toCode.split("-")[0], toTwoCode.split("-")[0], endCode.split("-")[0]];
              }else {
                dest = [fromCode.split("-")[0], toCode.split("-")[0]];
              }
              console.log(dest);
              writeToCSV(extractInfo, dest, travelDate);
              
              // console.log(extractInfo);   
              await page.waitForTimeout(1000 + Math.random() *5000);
          }
            
          }

        }catch (error) {
          console.log(error, ' 寫入發生錯誤')
        }
      }
      
    }
  }
  
  


  // for (const date of dateTable){
  //   for (const item of destinations)  {
  //     to = item.to;
  //     toCountry = item.toCountry;
  //     toCode = item.toCode;
      
      
  //     fromMonth = date.startM;
  //     fromDay = date.startD; 
  //     toMonth = date.endM;
  //     toDay = date.endD;
  //     const url = `https://www.expedia.com.tw/Flights-Search?
  //   flight-type=on&mode=search
  //   &trip=roundtrip&leg1=from:${from}, ${fromCountry} (${fromCode}),to:${to},${ toCountry }(${toCode}),departure:${fromYear}/${fromMonth}/${fromDay}TANYT&leg2=from:${to}, ${toCountry} (${toCode}),to:${from}, ${fromCountry} (${fromCode}),departure:${toYear}/${toMonth}/${toDay}TANYT&options=cabinclass:economy&
  //   fromDate=${fromYear}/${fromMonth}/${fromDay}&toDate=${toYear}/${toMonth}/${toDay}&d1=${fromYear}-${fromMonth}-${fromDay}&d2=${toYear}-${toMonth}-${toDay}&passengers=adults:${adultNum},infantinlap:N`
    
    // console.log(html);
  //   const text = await page.evaluate(() => {
  //     return new XMLSerializer().serializeToString(document);
  // });
  // console.log(text);
  //   }      

  // }
  // await browser.close();
};

const doCrawler = async(page, url) => {
  

  // const page = await browser.newPage();
  console.log('doCrawler  ----------------');
  try{
    await page.goto(url,{waitUntil: 'load'});
    
    
    await page.waitForSelector('.uitk-card-link');
    

    
    const extractInfo = []
    const rawInfo =  await page.
    $$eval('.uitk-card-link', elements => 
    elements.slice(0, 3).map(el => el.querySelector('span:first-child').textContent)
    );
    console.log('rawInfo*****************------------------------------*****************');
    console.log(rawInfo);

    return [rawInfo];


  }catch(error) {
    console.log('發生錯誤拉 ',error);
  }

}
// `https://www.expedia.com.tw/Flights-Search?
// flight-type=on&mode=search
// &trip=roundtrip&leg1=from:${from}, ${fromCountry} (${fromCode}),to:${to},${ toCountry }(${toCode}),departure:${fromYear}/${fromMonth}/${fromDay}TANYT&leg2=from:${to}, ${toCountry} (${toCode}),to:${from}, ${fromCountry} (${fromCode}),departure:${toYear}/${toMonth}/${toDay}TANYT&options=cabinclass:economy&
// fromDate=${fromYear}/${fromMonth}/${fromDay}&toDate=${toYear}/${toMonth}/${toDay}&d1=${fromYear}-${fromMonth}-${fromDay}&d2=${toYear}-${toMonth}-${toDay}&passengers=adults:${adultNum},infantinlap:N`
// `
// `https://www.expedia.com.tw/Flights-Search?
// flight-type=on&mode=search
// &trip=multi&leg1=from:${from}, ${fromCountry} (${fromCode}),to:${to},${ toCountry }(${toCode}),departure:${fromYear}/${fromMonth}/${fromDay}TANYT&leg2=from:${toTwo},${ toTwoCountry }(${toTwoCode}),to:${from}, ${fromCountry} (${fromCode}),departure:${fromYear}/${fromMonth}/${fromDay}TANYT&options=cabinclass:economy&
// fromDate=${toYear}/${toMonth}/${toDay}&d1=${toYear}-${toMonth}-${toDay}&passengers=adults:1,infantinlap:N`

// `https://www.expedia.com.tw/Flights-Search?
// leg1=from:Taipei (TPE-Taoyuan Intl.),to:Prague (PRG-Vaclav Havel),departure:2024/2/28TANYT&
// leg2=from:Zagreb (ZAG - Zagreb),to:Taipei (TPE - Taoyuan Intl.),
// departure:2024/3/26TANYT&
// mode=search&options=carrier:,cabinclass:,maxhops:1,nopenalty:N&pageId=0&passengers=adults:1,children:0,infantinlap:N&trip=multi`



// `https://www.expedia.com.tw/Flights-Search?
// flight-type=on&mode=search
// &trip=multi&leg1=from:${from}, ${fromCountry} (${fromCode}),to:${to},${ toCountry }(${toCode}),departure:${fromYear}/${fromMonth}/${fromDay}TANYT&leg2=from:${to}, ${toCountry} (${toCode}),to:${from}, ${fromCountry} (${fromCode}),departure:${toYear}/${toMonth}/${toDay}TANYT&options=cabinclass:economy&
// fromDate=2023/12/2&d1=2023-12-2&passengers=adults:1,infantinlap:N`

// `https://www.expedia.com.tw/Flights-Search?
// flight-type=on&mode=search
// &trip=multi&leg1=from:Taipei, Taiwan (TPE-Taoyuan Intl.),to:Zürich, Switzerland (ZRH),departure:2023/12/2TANYT&leg2=from:Zagreb, Croatia (ZAG),to:Taipei, Taiwan (TPE-Taoyuan Intl.),departure:2024/1/25TANYT&options=cabinclass:economy&
// fromDate=2023/12/2&d1=2023-12-2&passengers=adults:1,infantinlap:N`



// 'sec-ch-ua': '"Chromium";v="122", " Not A;Brand";v="99", "Google Chrome";v="122"',
//   'accept-language': 'en-US,en;q=0.9',
//   'sec-ch-ua-mobile': '?0',
//   'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6182.0 Safari/537.36',
//   'content-type': 'application/json',
//   accept: 'application/json',
//   referer: 'https://www.expedia.com.tw/Flights-Search?flight-type=on&mode=search&trip=multi&leg1=from:Taipei,%20Taiwan%20(TPE-Taoyuan%20Intl.),to:Prague,Czechia(PRG-Vaclav%20Havel),departure:2024/1/20TANYT&leg2=from:Milan,Italy(MXP-Malpensa%20Intl.),to:Taipei,%20Taiwan%20(TPE-Taoyuan%20Intl.),departure:2024/2/10TANYT&options=cabinclass:economy&fromDate=2024/1/20&d1=2024-2-10&passengers=adults:1,infantinlap:N',
//   'sec-ch-ua-platform': '"Mac OS X"'

// `https://www.expedia.com.tw/Flights-Search?d1=2024-1-23&d2=2024-1-31&flight-type=on&fromDate=2024%2F1%2F23&langid=1028&leg1=from%3ATaipei%2C%20Taiwan%20%28TPE-Taoyuan%20Intl.%29%2Cto%3AVienna%2C%20Austria%20%28VIE-Vienna%20Intl.%29%2Cdeparture%3A2024%2F1%2F23TANYT&leg2=from%3AVienna%2C%20Austria%20%28VIE-Vienna%20Intl.%29%2Cto%3ATaipei%2C%20Taiwan%20%28TPE-Taoyuan%20Intl.%29%2Cdeparture%3A2024%2F1%2F31TANYT&mode=search&options=cabinclass%3Aeconomy&passengers=adults%3A1%2Cinfantinlap%3AN&toDate=2024%2F1%2F31&trip=roundtrip`
// `https://www.expedia.com.tw/Flights-Search?d1=2024-1-23&d2=2024-1-31&flight-type=on&fromDate=2024%2F1%2F23&langid=1033&leg1=from%3ATaipei%2C%20Taiwan%20%28TPE-Taoyuan%20Intl.%29%2Cto%3AVienna%2C%20Austria%20%28VIE-Vienna%20Intl.%29%2Cdeparture%3A2024%2F1%2F23TANYT&leg2=from%3AVienna%2C%20Austria%20%28VIE-Vienna%20Intl.%29%2Cto%3ATaipei%2C%20Taiwan%20%28TPE-Taoyuan%20Intl.%29%2Cdeparture%3A2024%2F1%2F31TANYT&mode=search&options=cabinclass%3Aeconomy&passengers=adults%3A1%2Cinfantinlap%3AN&toDate=2024%2F1%2F31&trip=roundtrip`