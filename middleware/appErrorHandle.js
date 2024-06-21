//W5-4:增加開發狀態(Dev)與上線(Prod)狀態的錯誤回饋
const { errorHandle } = require('../services/errorHandle'); 

const resErrorProd = (err, res) => {
    if (err.isOperational) {
      errorHandle(res, err.statusCode, err.message);
    } else {
      if ( err.name === 'MulterError' && err.message === 'Field name missing') {
        return errorHandle(res, 400, 'format');
      }
      if ( err.name === 'TypeError') {
        return errorHandle(res, 400, 'format');
      }      

      // log 紀錄
      console.error('出現重大錯誤', err);
      // 送出罐頭預設訊息
      errorHandle(res, 500, '500');
    }
};

const resErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      message: err.message,
      errorDev: err,
      stack: err.stack
    });

};
// 錯誤處理
const appErrorHandle = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // dev
    if (process.env.NODE_ENV === 'dev') {
      return resErrorDev(err, res);
    } 
    // production
    if (err.name === 'ValidationError'){
      err.message = "資料欄位未填寫正確，請重新輸入！"
      err.isOperational = true;
      return resErrorProd(err, res);
    } 
    else if (err.name === 'CastError') {
      err.message = `id: ${err.value} 回傳格式錯誤，請重新輸入！`;
      err.isOperational = true;
      return resErrorProd(err, res); 
    }   
    else if (err.name === 'MulterError') {
      err.message = err.message;
      err.isOperational = true;
      return resErrorProd(err, res); 
    }        
    else if (err.name === 'SyntaxError') {
      err.message = '語法錯誤';
      err.isOperational = true;
      return resErrorProd(err, res); 
    }      
    else if (err.code === 'LIMIT_FILE_SIZE'){
      err.message = "上傳的檔案過大"
      err.isOperational = true;
      return resErrorProd(err, res);
    }
    
    resErrorProd(err, res)
}

module.exports = appErrorHandle;