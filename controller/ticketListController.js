// const { ticketPrice } = require('../utility/db/dbPool')
// const { Op } = require("sequelize");

const cheapTicketList = async(req, res, next) => {
//    console.log(req.query.type);
   console.log('req.query.type');
   console.log()

//    

    // let queryAttributes;
    // switch (req.query.type) {
    //     case '0':
    //         let whereCondition = {
    //             type: 0
    //         }
    //         if(!req.query.anywhere) {
    //             if(req.query.airport1) {
    //                 whereCondition.airport_1 = req.query.airport1
    //             }
    //             if(req.query.airport2) {
    //                 whereCondition.airport_2 = req.query.airport2
    //             }
    //         }

    //         queryAttributes = {
    //             attributes: ['airport_1', 'airport_2', 'airport_3',  'airport_4', 'date_1', 'date_2', 'price', 'type'],
    //             where: whereCondition
    //         }
            
    //         break;
    //     case '1':
    //         break;
    //     case '2':
    //         break;
    //     default:
    //         break;        
    // }
    // const resp = await ticketPrice.findAll( queryAttributes )
    // const resp = await ticketPrice.findAll({
    //     attributes: ['airport_1', 'airport_2', 'airport_3',  'airport_4', 'date_1', 'date_2', 'price'],
    //     where: {
    //         airport_2: 'Milan',
    //         type: 0
    //     }
    // })

    res.status(200).json({
        status: 'success',
        data: {
          message:resp
        }
      });
}


module.exports = { cheapTicketList };
