const express = require('express');

const checkController = require('../controllers/check');

const router = express.Router();

router.get('/check/:_id', checkController.getIndex);

module.exports = router;