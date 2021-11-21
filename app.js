require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
// var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/usersRouter');
var cryptosRouter = require('./routes/cryptos/cryptosRouter');
var cryptoProgramsRouter = require('./routes/cryptoPrograms/cryptoProgramsRouter')

const mongoose = require('mongoose')
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("");
    console.log("         ");
    console.log("");
    console.log("      ^^^^^           ^^^^^    ");
    console.log("     [ Con  ]        [ noC  ]");
    console.log("     [  nEc ]        [  cEn ]");
    console.log("     [ ted  ]        [ det  ]");
    console.log("               3001");
    console.log("           [O        O]       ");
    console.log("          [G   XYO    G]                  ");
    console.log("         [N     BTC    N]                  ");
    console.log("      [   [O   CRO    O]   ]   ");
    console.log("       D_  [M        M]  _D    ");
    console.log("         B_{WE ARE UP!}_B    ");
    console.log("         ___|        |___   ");
    console.log("        /                \\ ");
    console.log('        |  Stackin\' Sats |        ');
    console.log("        |                |");
    console.log("        {EE____________EE}        ");
  })
  .catch((err) => console.error(err))

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/cryptos', cryptosRouter);
app.use('/api/crypto-programs', cryptoProgramsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: "Error",
    err: err.message,
  });
});

module.exports = app;