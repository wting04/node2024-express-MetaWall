//W6: 驗證用戶是否登入
const jwt = require('jsonwebtoken');
//model
const User = require('../models/user');

const successHandle = require('../services/successHandle');
const appError = require('./appError'); 
const asyncErrorHandle = require('./asyncErrorHandle');

const isAuth = asyncErrorHandle(async (req, res, next) => {
    // 確認 token 是否存在
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(appError(401,'你尚未登入！',next));
    
    }
  
    // 驗證 token 正確性: jwt.verify(token, secret, [options, callback])
    const decoded = await new Promise((resolve,reject)=>{
      jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        if(err){
          return next(appError(403,'Token認證過期或格式錯誤，請重新登入',next));
        }else{
          resolve(payload)
        }
      })
    })
    //console.log(decoded); 
    const currentUser = await User.findById(decoded.id); //document data (JSON)
     
    req.user = currentUser; //[user]是自定義的req屬性
    next();

  });

  const generateSendJWT= (user,statusCode,res)=>{
    // 產生 JWT token: jwt.sign(payload, secret, [options, callback])
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn: process.env.JWT_EXPIRES_DAY
    });
    user.password = undefined;
    // res.status(statusCode).json({
    //   status: 'success',
    //   user:{
    //     token,
    //     name: user.name
    //   }
    // });
    const result = { user: { token:token, name:user.name } };
    successHandle(res,result);
  }

module.exports = {
    isAuth,
    generateSendJWT
}