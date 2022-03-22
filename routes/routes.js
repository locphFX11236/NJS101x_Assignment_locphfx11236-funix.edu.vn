const express = require('express');

const controller = require('../controllers/controller');

const router = express.Router();

router.get('/', controller.getIndex);

router.get('/staff/:staffId', controller.getStaffWithId);

router.post('/edit-staff', controller.postEditStaff);

module.exports = router;