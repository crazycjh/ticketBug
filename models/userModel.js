const { DataTypes } = require('sequelize');
const sequelize = require('../utility/db/databaseConnect')

const UserInfo = sequelize.define('UserInfo', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true,
        primaryKey: true,
    },
    password:DataTypes.STRING,
    passwordConfirm:DataTypes.STRING,
    passwordChangedAt:DataTypes.DATE,
    passwordResetToken:DataTypes.STRING,
    passwordResetExpires:DataTypes.DATE,
    google: DataTypes.BOOLEAN,
    unread: DataTypes.BOOLEAN,
    notify: DataTypes.BOOLEAN,
    
},
{
    hooks: {
        beforeCreate: (userInfo, options) => {
            // 這兩者都可以存取要寫入的那些資料，也可以去修改它做一些操作
            console.log(userInfo.dataValues.email); 
            console.log(userInfo.email); 
        },
        afterCreate: (userInfo, options) => {
            // 建立後的邏輯
        }
    },
    tableName: 'UserInfo',
    timestamps: false
    // createdAt: 'creationDate',
    
},
{
    
}

);

UserInfo.sync({ alter: true });
// 同步模型到数据库



module.exports = { UserInfo };
