//W6: Models 的驗證條件
const validator = require('validator');

const appError = require('./appError');
const { errorMag } = require('../services/errorHandle');


const customizeValidator = {
    name (name, next) {
        if (typeof name !== 'string') {
            return next(appError(400, `name ${errorMag.format}`, next));
        }

        // 名字長度至少 2 字元
        if (!validator.isLength(name, { min: 2 })) {
            return next(appError(400, 'name 長度至少 2 個字元以上', next));
        }

        return true;
    },    
    email (email, next) {
        // 是否為 email 格式
        if (!validator.isEmail(email)) {
            return next(appError(400, `email ${errorMag.format}`, next));            
        }

        return true;
    },
    url (value, next, field) {
        if (typeof value !== 'string') {
            return next(appError(400, `${field} ${errorMag.format}`, next));
        }

        // 須為 https 網址
        if (!validator.isURL(value, { protocols: ['https']})) {
            return next(appError(400, `${field} 須為 https 開頭的網址`, next));
        }

        return true;
    },    
    gender (gender, next) {
        //註冊新增用戶預設性別'empty'，在修改個人資訊時一併更新
        if (gender !== 'male' && gender !== 'female') {
            return next(appError(400, '性別未提供', next));
        }

        return true;
    },    
    password (password, next) {
        // 密碼長度至少 8 碼，且英數混合
        if (!validator.isLength(password, { min: 8 }) ||
            !validator.matches(password, /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/)
        ) {
            return next(appError(400, '密碼須至少 8 碼以上，並英數混合', next));
        }

        return true;
    },
};

module.exports = customizeValidator;