const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); //跨網域

const errorHandle = require('./services/errorHandle'); //W4
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

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
app.use('/posts', postsRouter);

//W4: 404 路由錯誤
app.use((req, res, next) => {
    errorHandle(res, 404, 'routing');
  });
  
module.exports = app;
