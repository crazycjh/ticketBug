const {Sequelize, DataTypes} = require('sequelize');

// 连接到数据库
// const sequelize = new Sequelize('snrsoixy_crawler', 'snrsoixy_andy', 'gcAndy855193', {
//   host: '144.48.140.14',
//   dialect: 'mysql'
// });
const sequelize = new Sequelize(process.env.DATABASE_DB, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'mysql',
    logging: false,
});


// 32272

// 定义模型
const ticketPrice = sequelize.define('ticketPrice', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
        
    },
    createDate:DataTypes.STRING,
    airport_1: DataTypes.STRING,
    airport_2: DataTypes.STRING,
    airport_3: DataTypes.STRING,
    airport_4: DataTypes.STRING,
    airport_5: DataTypes.STRING,
    airport_6: DataTypes.STRING,
    airport_7: DataTypes.STRING,
    airport_8: DataTypes.STRING,
    num: DataTypes.TINYINT,
    type: DataTypes.STRING,
    date_1: DataTypes.STRING,
    date_2: DataTypes.STRING,
    date_3: DataTypes.STRING,
    date_4: DataTypes.STRING,
    price: DataTypes.INTEGER,
    source: DataTypes.STRING,
    layover_info: DataTypes.STRING,
    url: DataTypes.STRING
    // metadata: {
    //     type: DataTypes.JSON
    // }
 
  
  
},
{
    tableName: 'ticketPrice',
    timestamps: false
    // createdAt: 'creationDate',

});

// 同步模型到数据库



module.exports = { ticketPrice };





