const express = require('express');
const router = express.Router();

const home_controller = require('../controller/home_controller');

router.get('/', home_controller.home);

console.log("router has been loaded");

module.exports = router;