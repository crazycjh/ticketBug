const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../utility/db/databaseConnect')

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
