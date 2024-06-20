const express = require('express');
const router = express.Router();

//W6
const UsersControllers = require('../controllers/users_api');
//middleware
const asyncErrorHandle = require('../middleware/asyncErrorHandle');
const { isAuth } = require('../middleware/auth');

//註冊
router.post('/sign_up', asyncErrorHandle(UsersControllers.signUp));
//登入
router.post('/sign_in', asyncErrorHandle(UsersControllers.signIn));
//重設密碼
router.post('/updatePassword', isAuth, asyncErrorHandle(UsersControllers.updatePassword));
//取得個人資料(by驗證用戶) 
router.get('/profile', isAuth, UsersControllers.getProfile);
//更新個人資料(by驗證用戶)
router.patch('/profile', isAuth, asyncErrorHandle(UsersControllers.editProfile));

module.exports = router;
