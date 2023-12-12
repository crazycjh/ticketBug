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
  console.log('do crawler?'); 
  try {
    browser = await puppeteer.launch({
      // executablePath:
      //   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // 替换为你的 Chrome 可执行文件的路径
      
      //以module的方式安裝，避免在server上沒辦法執行
      executablePath: chromium.path, 
      args: ['--lang=en-US'],
      headless:"new", // 根据需要设置为 true 或 false
    });
    
  }catch(error) {
    console.log('puppeteer 出事拉',error);
  }
  
  
  console.log('do crawler? 222222');

  
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
          let dest = [];
          const url = `https://www.expedia.com/Flights-Search?flight-type=on&mode=search&trip=roundtrip&leg1=from:${from}, ${fromCountry} (${fromCode}),to:${to},${ toCountry }(${toCode}),departure:${fromYear}/${fromMonth}/${fromDay}TANYT&leg2=from:${to}, ${toCountry} (${toCode}),to:${from}, ${fromCountry} (${fromCode}),departure:${toYear}/${toMonth}/${toDay}TANYT&options=cabinclass:economy&fromDate=${fromYear}/${fromMonth}/${fromDay}&toDate=${toYear}/${toMonth}/${toDay}&d1=${fromYear}-${fromMonth}-${fromDay}&d2=${toYear}-${toMonth}-${toDay}&passengers=adults:${adultNum},infantinlap:N`
          const extractInfo = []
          const [page, rawInfo] = await doCrawler(browser ,url)
          
          if(page && rawInfo) {
            try {
              const travelDate = {fromYear, toYear, fromMonth, fromDay, toMonth, toDay}
              rawInfo.forEach((rawItem)=> {
                // 提取 Expedia 機票資訊
                const info = extractFlightInfo(rawItem, travelDate);
                if(info){
                  extractInfo.push(info);  
                }
                
              })
              // 寫回csv
              console.log(extractInfo.length)
              console.log(to);
              console.log(type);
              if(extractInfo.length > 0) {
                if(type==="OpenJaw"){
                  dest = [fromCode.split("-")[0], toCode.split("-")[0], toTwoCode.split("-")[0]];
                }else {
                  dest = [fromCode.split("-")[0], toCode.split("-")[0]];
                }
                console.log(dest);
                writeToCSV(extractInfo, dest, travelDate);
                
                // console.log(extractInfo);   
                await page.waitForTimeout(1000 + Math.random() *5000);
              }
            }catch (error) {
              console.log(error, ' 寫入發生錯誤')
            }
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
        let dest = [];
        const url = `https://www.expedia.com.tw/Flights-Search?flight-type=on&mode=search&trip=multi&leg1=from:${from}, ${fromCountry} (${fromCode}),to:${to},${ toCountry }(${toCode}),departure:${fromYear}/${fromMonth}/${fromDay}TANYT&leg2=from:${toTwo},${ toTwoCountry }(${toTwoCode}),to:${end}, ${endCountry} (${endCode}),departure:${toYear}/${toMonth}/${toDay}TANYT&options=cabinclass:economy&fromDate=${fromYear}/${fromMonth}/${fromDay}&d1=${toYear}-${toMonth}-${toDay}&passengers=adults:1,infantinlap:N`
        
        const [page, rawInfo] = await doCrawler(browser ,url)
        const extractInfo = [];
        console.log('rawInfo');
        console.log(rawInfo);
        let info = false;
        try {
          const travelDate = {fromYear, toYear, fromMonth, fromDay, toMonth, toDay}
          rawInfo.forEach((rawItem)=> {
            // 提取 Expedia 機票資訊
            info = extractFlightInfo(rawItem, travelDate);
            if(info){
              extractInfo.push(info);  
            }
          })
          // 寫回csv
          console.log(extractInfo.length)
          if(extractInfo.length > 0) {
            if(type==="OpenJaw"){
              dest = [fromCode.split("-")[0].trim(), toCode.split("-")[0].trim(), toTwoCode.split("-")[0].trim(), endCode.split("-")[0].trim()];
            }else {
              dest = [fromCode.split("-")[0].trim(), toCode.split("-")[0].trim()];
            }
            console.log(dest);
            writeToCSV(extractInfo, dest, travelDate);
            
            // console.log(extractInfo);   
            await page.waitForTimeout(1000 + Math.random() *5000);
            
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

const doCrawler = async(browser, url) => {
  

  
  try{
    const page = await browser.newPage();
    await page.goto(url,{waitUntil: 'load'});
    
    await page.waitForSelector('.uitk-card-link');
    
    const extractInfo = []
    const rawInfo =  await page.
    $$eval('.uitk-card-link', elements => 
    elements.slice(0, 3).map(el => el.querySelector('span:first-child').textContent)
    );
    await page.close();

    return [page, rawInfo];
    

  }catch(error) {
    console.log('發生錯誤拉 ',error);
    return [false, false];
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