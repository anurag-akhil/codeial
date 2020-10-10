const express = require('express');
const router = express.Router();

const home_controller = require('../controller/home_controller');
router.get('/', home_controller.home);
router.use('/posts/', require('./posts'));
router.use('/users/', require('./users'));
router.use('/comments', require('./comments'))
console.log("router has been loaded");

module.exports = router;