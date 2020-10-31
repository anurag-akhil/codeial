const express = require('express');
const router = express.Router();
const passport = require('passport');

const user = require("../controller/user_profile");

router.get('/', user.users);
router.get('/profile/:id', passport.checkAuthentication, user.profile);
router.get('/sign-up',user.sign_up);
router.get('/sign-in', user.sign_in);
router.get('/sign-out', user.sign_out);
router.get('/forgot-pass',user.forgot_pass);
router.get('/reset/:token', user.new_pass);
router.post('/change_pass', user.change_pass);
router.post('/recover-pass', user.recover_pass);
router.post('/create', user.create);
router.post('/update/:id', user.update);

router.post('/create_session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
),user.create_session);
module.exports = router;

router.get('/auth/google/', passport.authenticate('google', {scope:['profile', 'email']}));

router.get('/auth/google/callback', passport.authenticate('google', {faliureRedirect: 'users/sign-in'}),user.create_session);