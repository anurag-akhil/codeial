const express = require('express');
const router = express.Router();

const user = require("../controller/user_profile");

router.get('/profile', user.users);
router.get('/sign-up',user.sign_up);
router.get('/sign-in', user.sign_in);
router.get('/kill_cookie',user.kill_cookie);
router.post('/create', user.create);
router.post('/create_session', user.create_session);
module.exports = router;