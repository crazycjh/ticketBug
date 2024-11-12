const {crawler} = require('./crawler');
const { findFirstweekdayAndFollowingweekday, getSequencDateTable } = require('./getDateTable');
const {getAirportCode} = require('./airPortCode');


 exports.intervalDate = (req, res, next) => {
    // console.log(req);
    const {yearStart,yearEnd, startMonth, endMonth, weekdayStart, intervalDay, from, to} = req.body;

    // console.log(req.body);
    const dateTable = findFirstweekdayAndFollowingweekday(yearStart,yearEnd, startMonth,endMonth, weekdayStart, intervalDay);  
    // console.log(dateTable);
    const fromCode = getAirportCode(from);
    const toCode = [];

    to.forEach((item)=> {
      toCode.push(getAirportCode(item))

    });
    // console.log(dateTable, [fromCode, toCode])
    crawler(dateTable, 'RoundTrip', [fromCode, toCode]);

    res.status(200).json({
      status: 'success',
      data: {
        message: 'running'
      }
    });

}


exports.sequenceDate = function(req, res, next) { 
  
  // crawler(dateTable, 'OpenJaw');
  const {yearStart,yearEnd, startMonth, endMonth, weekdayStart, intervalDay} = req.body;
  res.status(200).json({
    status:'success',
    data: {
      message:'sequenceDate'
    }
  }) 
}

exports.sequenceOpenJawDate = function(req, res, next) { 
  const {yearStart,yearEnd, startMonth, endMonth, startDay, endDay, from, to, end, interval} = req.body;

  // const dateTable = getSequencDateTable(startYear,startMonth,startDay,endYear, endMonth, endDay);
  const dateTable = getSequencDateTable(yearStart,startMonth,startDay,yearEnd, endMonth,endDay ,interval);
  // console.log(dateTable);

  // 取得 airport code
  const fromCode = getAirportCode(from);
  const endCode = getAirportCode(end);
  const toCode = [];

  to.forEach((item)=> {
    const couple = []
    item.forEach((city)=> {
      couple.push(getAirportCode(city));
    })

    toCode.push(couple);
  });

  crawler(dateTable, 'OpenJaw', [fromCode, toCode, endCode]); 
  
  
  res.status(200).json({
    status:'success',
    data: {
      message:'sequenceDate'
    }
  }) 
}


exports.test = function (req, res, next) {
  // Set cookie with test data
  res.cookie('testCookie', 'test value', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: ".example.com"
  });
  res.status(200).json({
    status:'success',
    data: {
      message:'Test API'
    }
  }) 
}