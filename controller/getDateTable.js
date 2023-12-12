exports.findFirstweekdayAndFollowingweekday = (yearStart,yearEnd, startMonth, endMonth, weekdayStart, intervalDay) => {
    let dateS = new Date(yearStart, startMonth-1, 1);
    let dateE = new Date(yearEnd, endMonth-1 , 1);
    
    
    while (dateS.getDay() !== weekdayStart) {  // 0 是周日，2 是周二、6是週六
      dateS.setDate(dateS.getDate() + 1);
    }

    let startDate = new Date(dateS);
    let endDate = new Date(dateS);
    endDate.setDate(startDate.getDate() + intervalDay);
    
    const durationPair = [];
    
    while(startDate.getTime() < dateE.getTime() ) {
      
  
      durationPair.push({
        startY : startDate.getFullYear(),
        endY : endDate.getFullYear(),
        startM : startDate.getMonth()+1 ,
        startD : startDate.getDate() ,
        endM : endDate.getMonth()+1, 
        endD : endDate.getDate() 
       });
      startDate.setDate(startDate.getDate()+7);
      endDate.setDate(endDate.getDate()+7);
    }
    
    
  // startDate.getMonth()
      return durationPair;
  }

  exports.getSequencDateTable = (startYear,startMonth,startDay,endYear, endMonth, endDay, interval=3) => {
    // let dateS = new Date(startYear, startMonth-1, startDay);
    // let dateE = new Date(endYear, endMonth-1, endDay);

    // let newDateS = new Date(dateS);
    // let newDateE = new Date(dateE);
    
    const durationPair = [];
    for (let i=0; i<interval; i++){
      for (let x=0; x < interval; x++){
        let dateS = new Date(startYear, startMonth-1, startDay);
        let dateE = new Date(endYear, endMonth-1, endDay);
        
        dateS.setDate(dateS.getDate()+i);
        dateE.setDate(dateE.getDate()+x);
        
        durationPair.push({
          startY : dateS.getFullYear(),
          endY : dateE.getFullYear(),
          startM : dateS.getMonth()+1 ,
          startD : dateS.getDate() ,
          endM : dateE.getMonth()+1, 
          endD : dateE.getDate() 
         });
      }
    }
    
    return durationPair;
  }