const express = require('express');

const salaryController = require('../controllers/salary');

const router = express.Router();

router.get('/salary/:_id', salaryController.getIndex);

module.exports = router;