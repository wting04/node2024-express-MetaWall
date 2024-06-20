//model    
const Post = require('../models/post');
const User = require('../models/user'); //W4

//middleware
const appError = require('../middleware/appError'); //W5-3: 可預期錯誤的管理，替代原{errorHandle}
//回傳結果模組化
const successHandle = require('../services/successHandle');
//const { errorHandle } = require('./services/errorHandle'); 

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
         const allPost = await Post.find(q).populate({
             path: 'user', // PostSchema 的欄位名稱
             select: 'name photoUrl' // 要取得的資料欄位
         }).sort(timeSort);         
        
        //由貼文時間的新到舊顯示
        //const allPost = await Post.find().sort({createdAt: -1});
        // res.status(200).json({
        //     "status": "success",
        //     "data": allPost
        // });
        successHandle(res, allPost);
    },
    async createPost(req, res, next){
        const data = req.body;
        if(data.content === undefined){
            return next(appError(400,"發文內容 content 未提供"));
        }
        const newPost = await Post.create(
            {
                user: data.user,
                content: data.content.trim(),
                imageUrl: data.imageUrl,
                likes: data.likes                                  
            }
        );    
        successHandle(res, newPost);        
/*
        try{
            const data = req.body;
            if (data.content !== undefined) {
                const newPost = await Post.create(
                    {
                        user: data.user,
                        content: data.content.trim(),
                        imageUrl: data.imageUrl,
                        likes: data.likes                                  
                    }
                );
                successHandle(res, newPost);
            } else {
                errorHandle(res, 400, 'format');
            }                    

        }catch(error){
            errorHandle(res, 400, 'format');
        }
*/            
    }, 
    async deleteAllPost(req, res, next){
        if(req.originalUrl === '/posts'){
            const datanum = await Post.find().count();
            if(datanum >= 1){
                await Post.deleteMany({});
                successHandle(res, []); //顯示清空
            }else{
                return next(appError(400, 'data', next));
            }

        }else{
            return next(appError(404, 'routing', next));
        }

    },  
    async deleteOnePost(req, res, next){
        try{
            const id = req.params.id;
            const delPost = await Post.findByIdAndDelete(id);
            if (delPost) {
                successHandle(res, delPost);
            } else {
                return next(appError(400, 'id', next));
            }            
        }catch(error){
            return next(appError(400, 'id', next));
        }
    },           
    async editOnePost(req, res, next){
        const data = req.body; //AS POST 
        if(data.content === undefined){
            return next(appError(400,"發文內容 content 未提供"));
        }  
        const upddata = { 
            user: data.user,
            content: data.content.trim(),
            imageUrl: data.imageUrl, 
            likes: data.likes       
        };
        //更新單筆
        const id = req.params.id; //AS DELETE{id}
        //option開啟new 可回傳修改成功的資料、開啟runValidators 作更新資料的驗證
        const resPost = await Post.findByIdAndUpdate(id,upddata,{new: true, runValidators: true});                  
        if (resPost) {
            successHandle(res, resPost);
        } else {
            return next(appError(400, 'id', next));
        } 
/*
        try{
            const data = req.body; //AS POST 

            if (data.user !== undefined && data.content !== undefined) {
                const upddata = { 
                    user: data.user,
                    content: data.content.trim(),
                    imageUrl: data.imageUrl, 
                    likes: data.likes       
                };
                //更新單筆
                const id = req.params.id; //AS DELETE{id}
                //option開啟new 可回傳修改成功的資料、開啟runValidators 作更新資料的驗證
                const resPost = await Post.findByIdAndUpdate(id,upddata,{new: true, runValidators: true});                  
                if (resPost) {
                    successHandle(res, resPost);
                } else {
                    errorHandle(res, 400, 'id');
                } 
            } else {
                errorHandle(res, 400,'update');                
            }                                           
        }catch(error){
            errorHandle(res, 400, 'update');
        }  
*/              
    }, 
}

module.exports = posts_api;