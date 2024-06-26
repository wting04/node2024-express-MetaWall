//W6: 用戶登入驗證與用戶資料處理
const bcrypt = require('bcryptjs');
//model 
const Post = require('../models/post'); //W8
const User = require('../models/user');
//middleware
const appError = require('../middleware/appError');
const { generateSendJWT } = require('../middleware/auth');
const customizeValidator = require('../middleware/customizeValidator');

const successHandle = require('../services/successHandle');


const users_api = {
  //=====會員按讚追蹤動態===== W8
  async addFollow (req, res, next) {
    if (req.params.userID === req.user.id) {
      return next(appError(401,'您無法追蹤自己',next));
    }
    const findUser = await User.findOne({"_id":req.params.userID});
    if(!findUser){
        return next(appError(400,'unfindUser',next));
    }
   
    // 更新到追隨者
    await User.updateOne(
      {
        _id: req.user.id,
        'following.user': { $ne: req.params.userID }
      },
      {
        $addToSet: { following: { user: req.params.userID } }
      }
    );
    // 更新到跟隨者
    await User.updateOne(
      {
        _id: req.params.userID,
        'followers.user': { $ne: req.user.id }
      },
      {
        $addToSet: { followers: { user: req.user.id } }
      }
    );
    res.status(200).json({
      status: 'success',
      message: '您已成功追蹤！'
    });
  },
  async unFollow (req, res, next) {
    if (req.params.userID === req.user.id) {
      return next(appError(401,'您無法取消追蹤自己',next));
    }
    const findUser = await User.findOne({"_id":req.params.userID});
    if(!findUser){
        return next(appError(400,'unfindUser',next));
    }    
    // 更新到追隨者
    await User.updateOne(
      {
        _id: req.user.id
      },
      {
        $pull: { following: { user: req.params.userID } }
      }
    );
    // 更新到跟隨者
    await User.updateOne(
      {
        _id: req.params.userID
      },
      {
        $pull: { followers: { user: req.user.id } }
      }
    );
    res.status(200).json({
      status: 'success',
      message: '您已成功取消追蹤！'
    });
  },
  async getLikeList (req, res, next) {
    const likeList = await Post.find({
      likes: { $in: [req.user.id] }
    }).populate({
      path:"user",
      select:"name _id"
    }).sort('-createdAt');
    successHandle(res, likeList);

  },
  async getFollowingList (req, res, next) {
    const followingList = await User.findById(req.user.id)
                                    .select('following.user following.createdAt')
                                    .populate({ path:"following.user",
                                                select:"name photoUrl" });

    successHandle(res,followingList.following);
     
  },
  
  //=====會員功能=====  
    async signUp (req, res, next) {
      let { email,password,confirmPassword,name } = req.body;
      // 內容不可為空
      if(!email||!password||!confirmPassword||!name){
        return next(appError(400,"required",next));
      }
      //User Model的驗證條件
      const isValid = customizeValidator.email(email, next) && 
                      customizeValidator.password(password, next) && 
                      customizeValidator.name(name, next);
      if (!isValid) { return }

      const user = await User.findOne({"email":email});
      if(user){
        return next(appError(400,"此帳號已被註冊",next));
      } 

      // 密碼正確
      if(password!==confirmPassword){
        return next(appError(400,"密碼不一致！",next));
      }       

      // 加密密碼
      password = await bcrypt.hash(req.body.password,12);
      const newUser = await User.create({
        email,
        password,
        name
      });
      
      generateSendJWT(newUser,201,res);
    },
    async signIn (req, res, next) {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(appError( 400,'required',next));
      }

      const isValid = customizeValidator.email(email, next);
      if (!isValid) { return }

      const findUser = await User.findOne({ email }).select('+password');
      if (!findUser) { return next(appError(400, '此帳號尚未註冊', next)) }
      
      // 比對 post 密碼與資料庫密碼是否一致
      const auth = await bcrypt.compare(password, findUser.password);
      if (!auth) { return next(appError(400, '輸入密碼不正確', next)) }
      
      generateSendJWT(findUser,200,res);    
    },
    async updatePassword (req, res, next) {
        const {password, confirmPassword } = req.body;
        const isValid = customizeValidator.password(password, next);
        if (!isValid) { return }        
        if (password !== confirmPassword) { 
          return next(appError(400, '密碼不一致！', next)) 
        }                
        const newPassword = await bcrypt.hash(password,12);        
        const user = await User.findByIdAndUpdate(req.user.id,
          {password: newPassword},
          {new: true, runValidators: true}
        );
        generateSendJWT(user,200,res);
        //successHandle(res, "密碼更新成功");
    },
    async getProfile (req, res, next) {
        // res.status(200).json({
        //     status: 'success',
        //     user: req.user
        //   }); 
        const getUser = { user: req.user };
        successHandle(res,getUser);                  
    },    
    async editProfile (req, res, next) {
      const { name, photoUrl, gender } = req.body;
      // 內容不可為空
      if(!name || !gender){
        return next(appError(400,"required",next));
      }
      //Models的驗證條件
      //註冊新增用戶預設性別'empty'，在修改個人資訊時一併更新
      const isValid = customizeValidator.url(photoUrl, next, 'photoUrl') && 
                      customizeValidator.name(name, next) && 
                      customizeValidator.gender(gender, next);
      if (!isValid) { return }

      const upddata = {
        name: name,
        photoUrl: photoUrl,
        gender: gender
      }

      const resUser = await User.findByIdAndUpdate(req.user.id,upddata,{new:true,runValidators:true});
      if (resUser) {
        successHandle(res, resUser);
        } else {
            return next(appError(400, 'Token 認證錯誤，請重新登入', next));
        }
    },        
}

module.exports = users_api;