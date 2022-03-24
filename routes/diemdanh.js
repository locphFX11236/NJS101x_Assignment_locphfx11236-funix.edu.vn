const express = require('express');

const diemdanh = require('../controllers/diemdanh');

const router = express.Router();

router.get('/diemdanh/:staffId', diemdanh.getIndex);

module.exports = router;