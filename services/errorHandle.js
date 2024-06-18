const errorMag = {
    'data': '無資料',
    'id': '無此 _id',
    'format': '回傳格式錯誤，或欄位填寫錯誤',
    'update': '更新失敗',
    'routing': '無此網站路由'    
}

const errorHandle = (res, statusCode, errorKey) => {
    res.status(statusCode).json({
        "status": "false",
        "errorMag": errorMag[errorKey],
    });
}

module.exports = errorHandle;