const mongoose = require('mongoose');

/*
* 貼文(頭)集合欄位
- userName：發文者名稱(必填)
- content：發文內容(必填)
- imageUrl：發文圖片
- likes：按讚數

- createdAt：發文時間(系統產生)
- updatedAt：異動時間(系統產生)

- 關聯的身檔: Comment Model
*/

const PostSchema = new mongoose.Schema(
    {     
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User", // 同user.js的mongoose.model('User', UserSchema);
            required: [true, '發文者名稱 user 未提供']
        },
        content: {
            type: String,
            required: [true, "發文內容 content 未提供"]        
        },
        imageUrl: {
            type: String,
            default: ""            
        },
        //W8更新
        likes: [{
            type: mongoose.Schema.ObjectId,
            ref: "User", // 填寫 model name
        }],

    },
    // schema options:
    {
        versionKey: false, //移除欄位 _v
        timestamps: true,
        toJSON: { virtuals: true }, // 使用 PostSchema.virtual 需要設定
        toObject: { virtuals: true } // 使用 PostSchema.virtual 需要設定 
    }
);

//W8: 有關聯到才引用
PostSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'post',
    localField: '_id'
  });

//模組名稱字首大寫
//mongoose issue: Post(模組名稱) > posts(DB collection name)
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;