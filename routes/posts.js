const express = require('express');
const router = express.Router();

//路由處理內容模組化
const PostsControllers = require('../controllers/posts_api');
//W5-2:重構自訂 try catch
const asyncErrorHandle = require('../middleware/asyncErrorHandle'); 
//W6: 驗證用戶是否登入
const { isAuth } = require('../middleware/auth'); 

//=====動態貼文=====
//取得所有貼文
router.get('/', isAuth, PostsControllers.getPost);
//取得單一貼文 (W8)
router.get('/:id', isAuth, PostsControllers.getOnePost);
//新增貼文
router.post('/', isAuth, asyncErrorHandle(PostsControllers.createPost));
//新增一則貼文的讚 (W8)
router.post('/:id/like', isAuth, asyncErrorHandle(PostsControllers.addPostLike));
//取消一則貼文的讚 (W8)
router.delete('/:id/unlike', isAuth, asyncErrorHandle(PostsControllers.undoPostLike));
//新增一則貼文的留言 (W8)
router.post('/:id/comment', isAuth, asyncErrorHandle(PostsControllers.addPostComment));
//取得個人所有貼文列表 (W8)
router.get('/user/:userID', isAuth, asyncErrorHandle(PostsControllers.getPostList));

router.delete('/', isAuth, PostsControllers.deleteAllPost);
router.delete('/:id', isAuth, asyncErrorHandle(PostsControllers.deleteOnePost));
router.patch('/:id', isAuth, asyncErrorHandle(PostsControllers.editOnePost));

module.exports = router;
