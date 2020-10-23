const express = require('express');
const router = express.Router();

const home_controller = require('../controller/home_controller');
router.get('/', home_controller.home);
router.use('/posts/', require('./posts'));
router.use('/users/', require('./users'));
router.use('/comments', require('./comments'));
router.use('/api', require('./api'));
console.log("router has been loaded");

module.exports = router;