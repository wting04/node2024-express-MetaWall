const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); //跨網域

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

require('./connections'); //資料庫連線

app.use(cors()); //跨網域引用
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
