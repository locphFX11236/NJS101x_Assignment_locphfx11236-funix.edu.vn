const express = require('express');

const salary = require('../controllers/salary');

const router = express.Router();

router.get('/salary/:staffId', salary.getIndex);

module.exports = router;