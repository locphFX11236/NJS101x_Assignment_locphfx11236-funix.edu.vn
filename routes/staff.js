const express = require('express');

const staffController = require('../controllers/staff');

const router = express.Router();

router.get('/', staffController.getIndex);

router.get('/staff/:_id', staffController.getStaffWithId);

router.post('/edit-staff', staffController.postEditStaff);

module.exports = router;