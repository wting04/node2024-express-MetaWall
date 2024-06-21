//W7
const express = require('express');
const router = express.Router();

const UploadControllers = require('../controllers/upload_api');
//middleware
const asyncErrorHandle = require('../middleware/asyncErrorHandle');
const { isAuth } = require('../middleware/auth');
const upload = require('../middleware/uploadImage');

router.post('/image',isAuth,upload,asyncErrorHandle(UploadControllers.uploadImg));

module.exports = router;
