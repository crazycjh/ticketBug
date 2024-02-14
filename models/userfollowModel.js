const { DataTypes } = require('sequelize');
const sequelize = require('../utility/db/databaseConnect')

const UserFollow = sequelize.define('UserFollow', {
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
    airport_1: DataTypes.STRING,
    airport_2: DataTypes.STRING,
    airport_3: DataTypes.STRING,
    airport_4: DataTypes.STRING,
    // 來回 0 或是 開口 1
    type: DataTypes.STRING,
    // 出發月 / 返回月
    month_1: DataTypes.STRING,
    month_2: DataTypes.STRING,
    
},
{
    tableName: 'UserFollow',
    timestamps: false
    // createdAt: 'creationDate',
    
});

UserFollow.sync({ alter: true });
// 同步模型到数据库



module.exports = { UserFollow };
