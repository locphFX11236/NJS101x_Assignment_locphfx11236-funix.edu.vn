const express = require('express');

const StaffController = require('../controllers/staff');

const router = express.Router();

router.get('/', StaffController.getIndex);
router.get('/staff/:_id', StaffController.getStaffWithId);
router.post('/edit-staff', StaffController.postEditStaff);

module.exports = router;