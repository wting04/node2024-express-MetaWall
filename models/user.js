const mongoose = require('mongoose');

/* W4
* 用戶集合欄位
- name：用戶名稱(必填)
- email：用戶電郵信箱(必填)
- photoUrl：用戶頭貼
- gender：用戶性別 

- createdAt：發文時間(系統產生)
- updatedAt：異動時間(系統產生)
*/

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, '用戶名稱 name 未填寫'] 
        },       
        email: {
            type: String,
            required: [true, '用戶電郵信箱 email 未填寫'],
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
        }          
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