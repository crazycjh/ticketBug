const cron = require('node-cron');
// const { ticketPrice } = require('../../')
const { ticketNotifyList } = require('../../models/ticketNotifyListModel')
const { UserFollow } = require('../../models/userfollowModel')
const { userNotification } = require('../../models/userNotificationModel')
const { UserInfo } = require('../../models/userModel')

// redis
const { socketList } = require('../redis/socketRedis')
const { publishNotification } = require('../redis/redis')

exports.dayliyPushNotification = async function() {
    // 抓取database便宜機票列表
    const notifyList = await ticketNotifyList.findAll({
        attributes:['id','createDate','airport_1', 'airport_2', 'airport_3', 'airport_4', 'date_1', 'date_2', 'type' ],
        where:{isPublished:false},
        raw: true 
        // 把尚未推播的抓出來
    })
    let month_1;
    let month_2;
    
    if(notifyList.length > 0){
        for(item of notifyList) {
            
            month_1 = item.date_1.slice(0, 6);
            month_2 = item.date_2.slice(0, 6);
    
            if(item.type === '0'){
                // 處理來回票

                // 查詢是否有有使用者訂閱該相同出發地、目的地及月份
                const notifyUsers = await UserFollow.findAll({
                    where: {
                        airport_1:item.airport_1,
                        airport_2:item.airport_2,
                        airport_3:item.airport_3,
                        airport_4:item.airport_4,
                        month_1,
                        month_2,
                        type:item.type
                    },
                    raw: true 
                })
                if(notifyUsers.length > 0) {
                    // 如果有找到就去那些人訂閱，就去該使用者的userNotification表寫入通知  
                    for(user of notifyUsers){
                        const resp = userNotification.create({
                            email:user.email,
                            notificationId: item.id,
                            createDate:item.createDate
                        })
                        // 對該使用者設定未讀，讓離線的使用者在登入時可以抓取到這個欄位，顯示有新通知
                        UserInfo.update(
                            {isRead: true},
                            {where: {email: user.email}}
                        )
                        
                        // 把通知推給使用者、寫入redis cache
                        
                        const userIsOnline = await socketList.hGet('user_statuses', user.email)
                        if(userIsOnline === 'online') {
                            console.log(item);
                            publishNotification(user.email, item)
                        }
                    }
                }
                // 把被推播的entry設定為true
                ticketNotifyList.update(
                    {isPublished: true},
                    {where: {isPublished: false}}
                )
            }else if(item.type === '1'){
                // 處理開口票
            }else{ // 多段票
            }

        };
    }else {
        console.log('空的')
    }
    // console.log(notifyList);
    // 從便宜機票列表中，找出年月+地點+source，再去follow table 中找出有符合的對象。
    // 找出對象後把所有如vie, 3月出發 4月返程的都寫入db，同個source不會超過一筆，但是可能會有不同source
    // 寫完後再把該使用者比對線上使用者，如果有則發出通知(建立一個通知object 紀錄個別使用者的通知數量，以後如果有需要顯示數量時)
    
    console.log('cron test');
    cron.schedule('*/5 * * * * *', () => {

    });
}
