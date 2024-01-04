const Sequelize = require('sequelize');

// 连接到数据库
// const sequelize = new Sequelize('snrsoixy_crawler', 'snrsoixy_andy', 'gcAndy855193', {
//   host: '144.48.140.14',
//   dialect: 'mysql'
// });
const sequelize = new Sequelize(process.env.DATABASE_DB, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    logging: false,
  });




// 定义模型
const ticketPrice = sequelize.define('ticketPrice', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    airport_1: Sequelize.STRING,
    airport_2: Sequelize.STRING,
    airport_3: Sequelize.STRING,
    airport_4: Sequelize.STRING,
    airport_5: Sequelize.STRING,
    airport_6: Sequelize.STRING,
    airport_7: Sequelize.STRING,
    airport_8: Sequelize.STRING,
    num: Sequelize.TINYINT,
    type: Sequelize.STRING,
    date_1: Sequelize.STRING,
    date_2: Sequelize.STRING,
    date_3: Sequelize.STRING,
    date_4: Sequelize.STRING,
    price: Sequelize.INTEGER,
    source: Sequelize.STRING,
    metadata: {
        type: Sequelize.JSON
    }
    
  
  
},
{
    tableName: 'ticketPrice',
    timestamps: false
});

// 同步模型到数据库



module.exports = { ticketPrice };





