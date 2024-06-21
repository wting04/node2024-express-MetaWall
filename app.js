const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); //跨網域

const { errorHandle } = require('./services/errorHandle'); //W5
const appErrorHandle = require('./middleware/appErrorHandle'); //W5
//const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload'); //W7

const app = express();
//W5-1: 程式出現重大錯誤時
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
    console.error('Uncaughted Exception！')
    console.error(err);
    process.exit(1);
});

require('./connections'); //資料庫連線

app.use(cors()); //跨網域引用
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter); //W7

//W4: 404 路由錯誤
app.use((req, res, next) => {
    errorHandle(res, 404, 'routing');
  });

//W5-4:增加開發狀態(Dev)與上線(Prod)狀態的錯誤回饋
app.use(appErrorHandle); 

//W5-1:未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
    console.error('未捕捉到的 rejection：', promise, '原因：', err);
});    
  
module.exports = app;
