//W7
const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size');
const firebaseAdmin = require('../connections/firebase');
const bucket = firebaseAdmin.storage().bucket();

const appError = require("../middleware/appError");
const successHandle = require('../services/successHandle');


const upload_api = {
    async uploadImg(req, res, next){
        //圖片於貼文(post) 或 個人資料(user)
        let { unit } = req.query;
        unit = unit ? unit : 'post';

        if(!req.files || !req.files.length) {
            return next(appError(400,"尚未上傳檔案",next));
        }
        if(req.files.length>1) {
            return next(appError(400,"只能上傳一個檔案",next));
        }
        // 取得上傳的檔案資訊列表裡面的第一個檔案
        const file = req.files[0];
        //圖片用於 user 大頭照限制判斷
        if(unit === 'user'){
            const dimensions = sizeOf(req.files[0].buffer);
            if (dimensions.width !== dimensions.height) {
                return next(appError(400, "頭貼圖片長寬寬高比必須為1:1", next));
            }

            if(dimensions.width<300){
                return next(appError(400, "頭貼圖片解析度寬度至少300像素以上", next));
            }
        }
        
        // 基於檔案的原始名稱建立一個 blob 物件
        const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`);
        // 建立一個可以寫入 blob 的物件
        const blobStream = blob.createWriteStream()
    
        // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
        blobStream.on('finish', () => {
            // 設定檔案的存取權限
            const config = {
                action: 'read', // 權限
                expires: '12-31-2500', // 網址的有效期限
            };
            // 取得檔案的網址
            blob.getSignedUrl(config, (err, fileUrl) => {
                const result = { imgUrl: fileUrl };
                successHandle(res,result);
            });
        });
    
        // 如果上傳過程中發生錯誤，會觸發 error 事件
        blobStream.on('error', (err) => {
            res.status(500).send('上傳失敗');
        });
    
        // 將檔案的 buffer 寫入 blobStream
        blobStream.end(file.buffer);
    }
};

module.exports = upload_api;