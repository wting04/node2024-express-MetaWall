const express = require('express');
const router = express.Router();

//路由處理內容模組化
const PostsControllers = require('../controllers/posts_api');

router.get('/', PostsControllers.getPost);
router.post('/', PostsControllers.createPost);
router.delete('/', PostsControllers.deleteAllPost);
router.delete('/:id', PostsControllers.deleteOnePost);
router.patch('/:id', PostsControllers.editOnePost);

module.exports = router;
