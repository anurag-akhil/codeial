const express = require('express');
const router = express.Router();
const passport = require('passport');
const post = require('../controller/posts_controller');

router.post('/create', passport.checkAuthentication, post.create);
router.get('/destroy/:id', passport.checkAuthentication, post.destroy);
module.exports = router;