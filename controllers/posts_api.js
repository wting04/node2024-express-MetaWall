const validator = require('validator');
//model    
const Post = require('../models/post');
const User = require('../models/user'); //W4
const Comment = require("../models/comment"); //W8
//middleware
const appError = require('../middleware/appError'); //W5-3: 可預期錯誤的管理，替代原{errorHandle}
const customizeValidator = require('../middleware/customizeValidator');
//回傳結果模組化
const successHandle = require('../services/successHandle'); 
const userPopulate = {
    path: 'user', // PostSchema 的欄位名稱
    select: 'name photoUrl' // 要取得的資料欄位
};
const commentsPopulate = {
    path: 'comments', // PostSchema 關聯Comment Model 的假欄位名稱
    select: 'comment user' //取得 CommentSchema 的欄位
};
// new 參數指定是否返回更新後的文件
// runValidators 參數指定是否在更新時 進行 Schema 定義的驗證器
const updateOptions = { new: true, runValidators: true };

/*將函式方法打包成物件
    function(req, res, next) {
        res.send('respond with a resource');
    }
*/
const posts_api = {
    async getPost(req, res, next){   
        /*
         *W4: 貼文關鍵字搜尋與貼文時間排序
         asc 遞增(由小到大，由舊到新) "createdAt"
         desc 遞減(由大到小、由新到舊) "-createdAt"
         RegExp(req.query.q) 可將前端字串轉換成 正規表達式物件
        */ 
         const timeSort = req.query.timeSort === "asc" ? "createdAt":"-createdAt";
         const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
         const allPost = await Post.find(q)
            .populate(userPopulate)
            .populate(commentsPopulate)
            .sort(timeSort);
                 
        //由貼文時間的新到舊顯示
        //const allPost = await Post.find().sort({createdAt: -1});
        // res.status(200).json({
        //     "status": "success",
        //     "data": allPost
        // });
        successHandle(res, allPost);
    },
    async getOnePost (req, res, next) {
        const post = await Post.findOne({"_id":req.params.id})
        .populate(userPopulate)
        .populate(commentsPopulate);

        if(!post){
            return next(appError(400,"無此貼文", next));
        }

        const result = { post: post };
        successHandle(res,result);
    },    
    async createPost(req, res, next){
        //console.log(req.user.id);
        const { imageUrl, content } = req.body;

        if(content === undefined){
            return next(appError(400,"發文內容 content 未提供"));
        }
        const isValid = !imageUrl || imageUrl && customizeValidator.url(imageUrl, next, 'imageUrl');
        if (!isValid) { return }
           
        const findUser = await User.findById(req.user.id);
        if (findUser) {
            const newPost = await Post.create(
                { 
                    user: req.user.id, 
                    imageUrl: imageUrl, 
                    content: content.trim()
                }
            );
            //successHandle(res, newPost);
            const newPostDetail = await newPost.populate({ 
                path: 'user', select: 'name imageUrl' 
            });
            successHandle(res,newPostDetail);   

        } else {
            return next(appError(400, '此用戶不存在', next));
        }     
        //asyncErrorHandles catch: errorHandle(res, 400, 'format');          
    }, 
    async addPostLike (req, res, next) {
        const _id = req.params.id;
        const likePost = await Post.findOneAndUpdate(
            { _id},
            { $addToSet: { likes: req.user.id } },
            updateOptions
          );
        if (!likePost) {
            return next(appError(400, 'idorAuth', next));
        }    
        successHandle(res, likePost);

    },  
    async undoPostLike (req, res, next) {
        const _id = req.params.id;
        const unlikePost =await Post.findOneAndUpdate(
            { _id},
            { $pull: { likes: req.user.id } },
            updateOptions
          );
        if (!unlikePost) {
            return next(appError(400, 'idorAuth', next));
        }    
        successHandle(res, unlikePost);

    },  
    async addPostComment (req, res, next) {
        const { body, user, params } = req;
        const { comment } = body;
        if(comment === undefined){
            return next(appError(400,"留言內容必填"));
        }

        const findPost = await Post.findById(params.id);
        if (!findPost) {
            return next(appError(400, 'idorAuth', next));
        }    

        const newComment = await Comment.create({
            post: params.id,
            user: user.id,
            comment
        });
        successHandle(res, newComment);

    }, 
    async getPostList (req, res, next) {
        //console.log(req.params.userID);
        const user = await User.findOne({"_id":req.params.userID});
        if(!user){
            return next(appError(400,'無此用戶',next));
        }

        const posts = await Post.find({user:req.params.userID})
                                .populate(commentsPopulate)
                                .sort("-createdAt");

        const result = { num: posts.length, posts: posts };
        successHandle(res,result);
        
    },      
    async deleteAllPost(req, res, next){
        console.log(req.user.id);
        if(req.originalUrl === '/posts'){
            // const datanum = await Post.find().count();
            // if(datanum >= 1){
                await Post.deleteMany({ user: req.user.id });
                successHandle(res, []); //顯示清空
            // }else{
            //     return next(appError(400, 'data', next));
            // }

        }else{
            return next(appError(404, 'routing', next));
        }

    },  
    async deleteOnePost(req, res, next){
        const { params, user } = req;
        
        const delPost = await Post.findOneAndDelete({ _id: params.id , user: user.id });
        if (delPost) {
            successHandle(res, delPost);
        } else {
            return next(appError(400, 'idorAuth', next));
        }       
                 
    },           
    async editOnePost(req, res, next){
        const { body, params, user } = req; //AS DELETE{id}
        const { imageUrl, content } = body; //AS POST 

        if(content === undefined){
            return next(appError(400,"發文內容 content 未提供"));
        }
        const isValid = !imageUrl || imageUrl && customizeValidator.url(imageUrl, next, 'imageUrl');
        if (!isValid) { return }        

        const upddata = { 
            content: content.trim(),
            imageUrl: imageUrl     
        };
        //更新單筆
        //option開啟new 可回傳修改成功的資料、開啟runValidators 作更新資料的驗證
        const resPost = await Post.findByIdAndUpdate(
            { _id: params.id, user: user.id},
            upddata,
            {new: true, runValidators: true});                  
        if (resPost) {
            successHandle(res, resPost);
        } else {
            return next(appError(400, 'idorAuth', next));
        }
        //asyncErrorHandles catch: errorHandle(res, 400, 'update'); 
          
    }, 
}

module.exports = posts_api;