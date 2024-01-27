const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

// const mongoSanitize = require('express-mongo-sanitize');
// const xssClean = require('xss-clean')

// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');
const flightRouter = require('./routes/flightRouter');
const tickList = require('./routes/Frontend/ticketlist');
// const sequenceRouter = require('./routes/sequenceRoutes');

const app = express();

// 1) Global MIDDLEWARES
app.use(helmet());
app.use(cors());
// development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

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
app.use('/api/v1/flightTicket', flightRouter);
app.use('/api/v1/ticketList', tickList);
// app.use('/api/v1/sequence', sequenceRouter);

app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    return res.status(400).send('error wrong URL');
});

// app.use(globalErrorHandler);

module.exports = app;
