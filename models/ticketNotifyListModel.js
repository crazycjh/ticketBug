const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../utility/db/databaseConnect')

const ticketNotifyList = sequelize.define('ticketNotifyList', {
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
    type: DataTypes.STRING,
    date_1: DataTypes.STRING,
    date_2: DataTypes.STRING,
    price: DataTypes.INTEGER,
    source: DataTypes.STRING,
    isPublished:DataTypes.BOOLEAN
},
{
    tableName: 'ticketNotifyList',
    timestamps: false
    // createdAt: 'creationDate',

});

// 同步模型到数据库
ticketNotifyList.sync({ alter: true });


module.exports = { ticketNotifyList };
