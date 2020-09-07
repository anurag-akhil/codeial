const express = require('express');
const router = express.Router();

const user = require("../controller/user_profile");

router.get('/', user.users);
router.get('/sign-up',user.sign_up);
router.get('/sign-in', user.sign_in);

router.post('/create', user.create);
module.exports = router;