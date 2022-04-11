const express = require('express');

const salaryController = require('../controllers/salary');

const router = express.Router();

router.get('/salary/:_id', salaryController.getIndex);
router.post('/post-seach-month', salaryController.seachMonth);

module.exports = router;