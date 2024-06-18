//資料庫
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//環境變數
dotenv.config({path: './config.env'});
//console.log(process.env.PORT); 
//連接資料庫
const DB = process.env.DATABASE.replace(
    "<password>", 
    process.env.DB_PASSWORD ??= ""
  );

mongoose.connect(DB)
    .then(()=>{ console.log("資料庫連線成功!")})
    .catch(error => {console.log(error)});