exports.extractFlightInfo = (str, travelDate) => {
    
    const {fromYear, toYear, fromMonth, fromDay, toMonth, toDay} = travelDate;

    const airline = str.match(/for (.+?) flight/)[1];
    const departureTime = str.match(/departing at ([^ ]+)/)[1];
    const departureLocation = str.match(/from ([^,]+)/)[1];
    const arrivalTime = str.match(/arriving at ([^ ]+)/)[1];
    const arrivalLocation = str.match(/in ([^,]+)/)[1];
    const priceString = str.match(/Priced at (NT\$\d+,\d+)/)[1];
    const price = Number(priceString.replace(/NT\$/, '').replace(/,/, ''));
    const totalTime = str.match(/(\d+ hours \d+ minutes) total travel time/)[1];
    const stops = str.match(/(Nonstop|One stop|Two stops)/)[1];
    const layoverInfo = str.match(/Layover for (.+?)(?=\.)|Layover for (.+?)$/g)[0];

    const fromDate = `${fromYear}${fromMonth.toString().padStart(2, '0')}${fromDay.toString().padStart(2, '0')}`;
    const toDate = `${toYear}${toMonth.toString().padStart(2, '0')}${toDay.toString().padStart(2, '0')}`;
    if(price < 31000) {
        return { airline, fromDate, departureTime, departureLocation, toDate, arrivalTime, arrivalLocation, price, totalTime, stops, layoverInfo };
    }
    else {
        return false;
    }
    
  }