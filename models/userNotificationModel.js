const { DataTypes } = require('sequelize');
const sequelize = require('../utility/db/databaseConnect')

const userNotification = sequelize.define('userNotification', {
    // 每個人可以有多個訂閱
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        
    },
    email: {
        type: DataTypes.STRING,
        isEmail: true,
    },
    notificationId: DataTypes.INTEGER,
    createDate: DataTypes.STRING,
},
{
    tableName: 'userNotification',
    timestamps: false    
});

userNotification.sync({ alter: true });
// 同步模型到数据库



module.exports = { userNotification };