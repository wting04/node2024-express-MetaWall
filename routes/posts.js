const express = require('express');
const router = express.Router();

//路由處理內容模組化
const PostsControllers = require('../controllers/posts_api');
//W5-2:重構自訂 try catch
const asyncErrorHandle = require('../middleware/asyncErrorHandle'); 
//W6: 驗證用戶是否登入
const { isAuth } = require('../middleware/auth'); 

router.get('/', isAuth, PostsControllers.getPost);
router.post('/', isAuth, asyncErrorHandle(PostsControllers.createPost));
router.delete('/', isAuth, PostsControllers.deleteAllPost);
router.delete('/:id', isAuth, asyncErrorHandle(PostsControllers.deleteOnePost));
router.patch('/:id', isAuth, asyncErrorHandle(PostsControllers.editOnePost));

module.exports = router;
