const express = require('express');

const checkController = require('../controllers/check'); // Liên kết với file controler xử lý hoạt động router
const isAuth = require('../middleware/is-auth'); // Liên kết với Middleware

const router = express.Router();

router
    .get( // Sử dụng phương thức get để thực hiện router
        '/check/:staff_id', // Bắt lấy path này
        isAuth, // Bảo vệ router
        checkController.getIndex // Lấy function getIndex để xử lý router
    )
;
// Tương tự với các router còn lại
router.post('/post-begin', isAuth, checkController.postBegin);
router.post('/post-end', isAuth, checkController.postEnd);
router.post('/confirmWork', isAuth, checkController.confirmWork);
router.post('/deleteWork', isAuth, checkController.deleteWork);
router.get('/annualLeave/:staff_id', isAuth, checkController.getAL);
router.post('/post-annualLeave', isAuth, checkController.postAnLeRe);
router.post('/confirmAnnu', isAuth, checkController.confirmAnnu);

module.exports = router;