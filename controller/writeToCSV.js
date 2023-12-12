const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');


exports.writeToCSV = (extractInfoArray, location, travelDate, type=false) => {
    if(type === 'intervalSeq'){

    }else if(type === 'OepnJaw'){

    }
    const {fromYear, toYear, fromMonth, fromDay, toMonth, toDay} = travelDate;

    let csvFilePath = '';
    
    const fromDate = `${fromYear}${fromMonth.toString().padStart(2, '0')}${fromDay.toString().padStart(2, '0')}`;
    const toDate = `${toMonth.toString().padStart(2, '0')}${toDay.toString().padStart(2, '0')}`;
    csvFilePath = `${fromDate}_${toDate}`
    
    location.forEach((location)=> {
        csvFilePath = `${csvFilePath}${location}`
        
    })
    csvFilePath = `${csvFilePath}.csv`
    console.log(csvFilePath);
    csvFilePath = `./flightCrawler/${csvFilePath}`
    // 檢查檔案是否存在
    const fileExists = fs.existsSync(csvFilePath);
    
    const csvWriter = createCsvWriter({
        path: csvFilePath,
        header: [
            {id: 'airline', title: 'AIRLINE'},
            {id: 'fromDate', title: 'FROM_DATE'},        
            {id: 'departureTime', title: 'DEPARTURE_TIME'},
            {id: 'departureLocation', title: 'DEPARTURE_LOCATION'},
            {id: 'toDate', title: 'To_DATE'},
            {id: 'arrivalTime', title: 'ARRIVAL_TIME'},
            {id: 'arrivalLocation', title: 'ARRIVAL_LOCATION'},
            {id: 'price', title: 'PRICE'},
            {id: 'totalTime', title: 'TOTAL_TIME'},
            {id: 'stops', title: 'STOPS'},
            {id: 'layoverInfo', title: 'LAYOVER_INFO'}
        ],
        append: fileExists
    });

    // csvWriter.writeRecords(extractInfoArray)
    // .then(() => {
        
    // });
}


