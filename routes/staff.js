const express = require('express');

const StaffController = require('../controllers/staff'); // Liên kết với file controler xử lý hoạt động router
const isAuth = require('../middleware/is-auth'); // Liên kết với Middleware

const router = express.Router();

router
    .get( // Sử dụng phương thức get để thực hiện router
        '/', // Bắt lấy path này
        StaffController.getIndex // Lấy function getIndex để xử lý router
    )
;
// Tương tự với các router còn lại
router.get('/staff/:_id', isAuth, StaffController.getStaffWithId);
router.post('/edit-staff', isAuth, StaffController.postEditStaff);

module.exports = router;