const express = require('express');

const checkController = require('../controllers/check');

const router = express.Router();

router.get('/check/:_id', checkController.getIndex);
router.post('/post-begin', checkController.postBegin);
router.post('/post-end', checkController.postEnd);
router.post('/post-annualLeave', checkController.postAnLeRe);

module.exports = router;