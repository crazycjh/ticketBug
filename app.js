const express = require('express');
const http = require('http');

// websocket
const { WebSocketServer } = require('ws');

// redis
const redis = require('redis');
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
// const sequenceRouter = require('./routes/sequenceRoutes');



const app = express();
const server = http.createServer(app);

// 1) Global MIDDLEWARES
app.use(helmet());
app.use(cors());
// development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
// 執行每日推播
console.log('每日推播');
dayliyPushNotification();

// 建立WebSocket
const wss = new WebSocketServer({ server })

wss.on('connection', function connection(ws) {
  // setInterval(()=> {
    ws.send('Welcom to the WebSocket Server');
  // }, 2000)
  
  ws.on('message', async function message(data) {
    const clientData = JSON.parse(data)
    const email = clientData.email;
    try{

      // 這裡會有唯一的client傳過來message，會是傳遞使用者名稱
      if(email) {
        // 做subscribe
        const channelId = `notifications:${email}` 
        console.log('subscriber ',channelId)
        subscriber.subscribe(channelId, (message) => {
          ws.send(message);
        });
        socketList.hSet('user_statuses', email, 'online');
        console.log('socketList get');
        console.log(await socketList.hGet('user_statuses', email));
        setTimeout(()=> {
          if(clientData.email === 'crazycjh@gmail.com') {
            publishNotification(email, 'this is test')
            
          }
        },2000)
        ws.on('close', () => {
          // unsubscribe ，要加上ping pong 檢查連線時，若是斷線則unsubscribe
          console.log('websocket disconneted');
          if(subscriber) {
            subscriber.unsubscribe();
            subscriber.quit();
            // 把登入狀態移除
            socketList.hDel('user_statuses', email);
          }
        })
        // 當redis publish時
        
      }
    }catch(error){
      console.error(error);
    }
    
  });
  
})

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

// app.use('/api/v1/sequence', sequenceRouter);

app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    return res.status(400).send('error wrong URL');
});

// app.use(globalErrorHandler);

module.exports = server;

