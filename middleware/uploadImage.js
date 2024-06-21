//W7: 圖片上傳功能
const multer = require('multer'); //可處理上傳接收到的檔案
const path = require('path');

const upload = multer({
  //上傳數據的限制: 最大文件上限2mb  
  limits: {
    fileSize: 2*1024*1024,
  },
  //控制可上傳哪些文件以及應跳過文件類型
  fileFilter(req, file, cb) {
    //console.log(file);
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb(new Error("檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。"));
      
    }
    cb(null, true);
  },
}).any();

module.exports = upload; 