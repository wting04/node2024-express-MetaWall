const mongoose = require('mongoose');

/* W4、W6、W8
* 用戶集合欄位
- name：用戶名稱(必填)
- email：登入帳號=用戶電郵信箱(必填)
- photoUrl：用戶頭貼
- gender：用戶性別 
- password: 登入密碼(必填)
- followers: 按讚列表
- following: 追蹤名單

- createdAt：發文時間(系統產生)
- updatedAt：異動時間(系統產生)
*/

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, '暱稱 name 未填寫'], 
            minlength: [2, 'name 長度至少 2 個字元以上']
        },
        email: {
            type: String,
            required: [true, '帳號 email 未填寫'],
            unique: true,
            lowercase: true,
            select: false
          },
        photoUrl: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            enum: ["male", "female", "empty"],  
            default: "empty"
        },
        //W6
        password:{
            type: String,
            required: [true, "帳號密碼未填寫"],
            minlength: 8, 
            select: false
          },
        //W8
        followers: [
            {
              user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
              },
              createdAt: {
                type: Date,
                default: Date.now
              }
            }
          ],
        following: [
            {
              user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
              },
              createdAt: {
                type: Date,
                default: Date.now
              }
            }
          ]          
    },
    // schema options:
    {
        versionKey: false, //移除欄位 _v
        timestamps: true 
    }
);

//模組名稱字首大寫
//mongoose issue: User(模組名稱) > users(DB collection name)
const User = mongoose.model('User', UserSchema);

module.exports = User;