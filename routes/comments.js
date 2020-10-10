const express = require('express');
const router = express.Router();
const passport = require('passport');
const comment = require('../controller/comment_controller');

router.post('/create', passport.checkAuthentication, comment.create);
router.get('/destroy/:id', passport.checkAuthentication, comment.destroy);
module.exports = router;