const errorMag = {
    'data': '無資料',
    'id': '無此 _id',
    'format': '回傳格式錯誤，請重新輸入！',
    'update': '更新失敗',
    'required': '必填欄位未填寫', //W5
    'routing': '無此網站路由',
    '500': '系統錯誤，請洽系統管理員' //W5     
}

const errorHandle = (res, statusCode, errorKey) => {
    //取代 obj.hasOwnProperty('key')，主要是確保程式碼不會被意外覆蓋掉。
    errorKey = 
        Object.prototype.hasOwnProperty.call(errorMag, errorKey) ? errorMag[errorKey] : errorKey;

    res.status(statusCode).json({
        status: false,
        //"errorMag": errorMag[errorKey],
        errorKey
    });
}

module.exports = { errorMag, errorHandle };