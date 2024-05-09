const { ticketPrice } = require('../models/ticketPriceModel')
const { Op, Sequelize } = require("sequelize");


const cheapTicketList = async(req, res, next) => {
    console.log(req.query);

//    

    let queryAttributes;
    let attributesAirport = [];
    let data=[];
    let airportList = [];
    let airportSet = [];
    let indexedData = [] ;
    let dateSet = [];
    let whereCondition = {}

    switch (req.query.type) {
        case '0':
            whereCondition.type = 0;
            // whereCondition  加入 date_1 和 date_2 的 where 條件 date_1 只有年月但是在database是年月日，只要篩選年月就可以了
            whereCondition.date_1 = {[Op.gte]: `${req.query.date1}%`};
            whereCondition.date_2 = {[Op.lte]: `${req.query.date2}%`};
            // console.log(whereCondition);
            if (!req.query.anywhere) {
                if (req.query.airport1) {
                    whereCondition.airport_1 = req.query.airport1;
                    console.log("req.query.airport1");
                    // console.log(req.query.airport1);

                } else {
                    // console.log("attributesAirport airport1");
                    attributesAirport = [[Sequelize.fn("DISTINCT", Sequelize.col("airport_1")), "airport"]];
                }
                if (req.query.airport2) {
                    // console.log(req.query.airport2);
                    // console.log("req.query.flushairport2");
                    whereCondition.airport_2 = req.query.airport2;
                } else {
                    // console.log("attributesAirport airport2");
                    attributesAirport = [[Sequelize.fn("DISTINCT", Sequelize.col("airport_2")), "airport"]];
                }
            }
            if(!req.query.anywhere) {
                if(req.query.airport1) {
                    whereCondition.airport_1 = req.query.airport1
                }else {
                    attributesAirport =[[Sequelize.fn('DISTINCT', Sequelize.col('airport_1')), 'airport']]
                }
                if(req.query.airport2) {
                    whereCondition.airport_2 = req.query.airport2
                }else {
                    attributesAirport = [[Sequelize.fn('DISTINCT', Sequelize.col('airport_2')), 'airport']]
                }
            }

            queryAttributes = {
                attributes: ['id', 'airport_1', 'airport_2', 'airport_3',  'airport_4', 'date_1', 'date_2', 'price', 'type','layover_info' ,'createDate'],
                where: whereCondition,
                order: [
                    ['date_1', 'ASC'] // 根据 date_1 升序排序
                ]
            }
            data = await ticketPrice.findAll( queryAttributes )
            const returnValue = indexData(data,0);
            [indexedData, dateSet] = returnValue;
            // 取得 機場列表
            if((!req.query.airport1 && req.query.airport2) || (req.query.airport1 && !req.query.airport2)) {
                queryAttributes = {
                    attributes: attributesAirport,
                    where: whereCondition
                }
    
                airportList = await ticketPrice.findAll( queryAttributes );
                if(!req.query.airport1) {
                    airportSet = {location :'航點 1', airportList : airportList};
                }else {
                    airportSet = {location :'航點 2', airportList : airportList};
                }
                
            }
            // data.map((item) => {
            //     item.airport_1
            // })
            break;
        case '1':
            break;
        case '2':
            break;
        default:
            break;
    }
    
    // const resp = await ticketPrice.findAll({
    //     attributes: ['airport_1', 'airport_2', 'airport_3',  'airport_4', 'date_1', 'date_2', 'price'],
    //     where: {
    //         airport_2: 'Milan',
    //         type: 0
    //     }
    // })
    console.log(Object.keys(dateSet));
    res.status(200).json({
        status: 'success',
        data:{data : indexedData, airportSet:airportSet, dateSet:Object.keys(dateSet)}
    });

}

function indexData(data, type) {
    // RT 以query的type來判斷
    const dateSet = [];
    const indexedData = data.reduce((acc, item) => {
        // date
        let firstLevelIndex = item.date_1 + '-' + item.date_2;
        
        // airport
        let secondLevelIndex;
        if(type === 0){
            secondLevelIndex = item.airport_2;
        }else if(type === 1){
            secondLevelIndex = item.airport_2 + '-' + item.airport_2;
        }
    
        if( !acc[firstLevelIndex]) {
            acc[firstLevelIndex] = {};
        }
        
        // const dateIndex = item.date_1 + '-' + item.date_2;
        // 用來記錄有哪些時間區段
        dateSet[firstLevelIndex] = true;        
        
        if(!acc[firstLevelIndex][secondLevelIndex]){
            acc[firstLevelIndex][secondLevelIndex] = [];
        }
        acc[firstLevelIndex][secondLevelIndex].push(item);
        return acc;
        }, {})
        dateSet.sort();
        return [indexedData, dateSet];
    }
    

module.exports = { cheapTicketList };
