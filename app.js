const express = require('express');
const http = require('http');
const cron = require('node-cron');

// websocket
const { WebSocketServer } = require('ws');

// redis
const redis = require('redis');
const cookieParser = require('cookie-parser');
const { checkRedisList } = require('./service/redis/notificationRedis')
const { publishNotification } = require('./service/redis/redis')
const { subscriber } = require('./service/redis/subscribeRedis')
const { socketList } = require('./service/redis/socketRedis')

const { dayliyPushNotification } = require('./service/scheduler/pushNotification')

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');


require('dotenv').config();


// const mongoSanitize = require('express-mongo-sanitize');
// const xssClean = require('xss-clean')

// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');
const flightRouters = require('./routes/flightRouters');
const tickList = require('./routes/Frontend/ticketlist');
const userRoutes = require('./routes/userRoutes')
const notificationRoutes = require('./routes/notificationRouters')
const triggerRoutes = require('./routes/triggerRouters')
// const sequenceRouter = require('./routes/sequenceRoutes');



const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}
// 1) Global MIDDLEWARES
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
// development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
// 執行每日推播
// dayliyPushNotification();
cron.schedule('*/10 * * * * *', () => {
  // dayliyPushNotification();
});
// 建立WebSocket
const wss = new WebSocketServer({ server })
try{
  wss.on('connection', function connection(ws) {
    // setInterval(()=> {
      ws.send(JSON.stringify({type:'MESSAGE',message:'Welcome to the WebSocket Server'}));
    // }, 2000)
      console.log('websocket 連線成功');

      

    ws.on('message', async function message(data) {
      const clientData = JSON.parse(data)
      const email = clientData.email;
      console.log('收到message from client ',clientData);
        // 這裡會有唯一的client傳過來message，會是傳遞使用者名稱
        if(email) {
          // 檢查Redis List是否有推播通知，因為很有可能server crash而清空了redis
          checkRedisList(email);
          // 做subscribe
          const channelId = `notifications:${email}` 
          subscriber.subscribe(channelId, (message) => {
            console.log('傳到client', message)
            ws.send(message);
          });
          // 
          socketList.hSet('user_statuses', email, 'online');

          // 當redis publish時
          
        }
      
      
    });
    ws.on('close', () => {
      // unsubscribe ，要加上ping pong 檢查連線時，若是斷線則unsubscribe
      console.log('websocket disconnected ',ws.id);
      try{
        if(subscriber) {
          subscriber.unsubscribe();
          console.log('unsubscribe');
          // 把登入狀態移除
          // socketList.hDel('user_statuses', email);
        }
      }catch(error) {
        console.error(error, ' 發生錯誤')
      }
    })

    ws.on('error', function error(err) {
      console.error('WebSocket error:', err);
      // 在这里处理错误，例如记录日志或尝试恢复连接
    });
  })
}catch(error) {
  console.error(error)
}

// // limit requests from same API
// const limiter = rateLimit({
//   max: 200,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour'
// });

// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS 
// app.use(xssClean());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/flightTicket', flightRouters);
app.use('/api/v1/ticketList', tickList);
app.use('/api/v1/users', userRoutes); 
app.use('/api/v1/notification', notificationRoutes); 
app.use('/api/v1/trigger', triggerRoutes); 
//  
// app.use('/api/v1/sequence', sequenceRouter);

app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    return res.status(400).send('error wrong URL');
});

// app.use(globalErrorHandler);

module.exports = server;

