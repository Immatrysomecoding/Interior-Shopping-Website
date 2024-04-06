const express = require('express');
const router = express.Router();
const blogController = require('../controller/PostController');

router.get('/post/:id', blogController.getPost);
router.post('/post/:id/comment', blogController.addComment);

module.exports = router;
