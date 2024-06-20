const express = require('express');
const router = express.Router();

//路由處理內容模組化
const PostsControllers = require('../controllers/posts_api');
//W5-2:重構自訂 try catch
const asyncErrorHandle = require('../middleware/asyncErrorHandle'); 

router.get('/', PostsControllers.getPost);
router.post('/', asyncErrorHandle(PostsControllers.createPost));
router.delete('/', PostsControllers.deleteAllPost);
router.delete('/:id', asyncErrorHandle(PostsControllers.deleteOnePost));
router.patch('/:id', asyncErrorHandle(PostsControllers.editOnePost));

module.exports = router;
