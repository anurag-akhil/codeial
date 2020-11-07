const express = require('express');
const router = express.Router();
const likes_controller = require('../controller/like_controller');

router.post('/toggle', likes_controller.toggleLikes);



module.exports = router;