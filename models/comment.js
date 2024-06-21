const mongoose = require('mongoose');

/* W8
* 貼文留言(身)集合欄位
- comment：貼文留言(必填)
- createdAt：留言建立時間
- user：留言者ID(必填)
- post：貼文ID(必填)
*/

const CommentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, '留言內容必填'],
            cast: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User", // 填寫 model name
            required: [true, 'user ID 必填']
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: "Post", // 填寫 model name
            required: [true, '貼文 ID 必填']
        }
    }, {
        versionKey: false // 移除欄位 __v
    }
);

// 所有 find 開頭的指令
CommentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user', //Comment的欄位
        select: 'id name photoUrl createdAt' //User的欄位
    });

    next();
}); 

//模組名稱字首大寫
//mongoose issue: Comment(模組名稱) > comments(DB collection name)
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

