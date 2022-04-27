const express = require('express');

const CovidController = require('../controllers/covid'); // Liên kết với file controler xử lý hoạt động router
const isAuth = require('../middleware/is-auth'); // Liên kết với Middleware

const router = express.Router();

router
    .get( // Sử dụng phương thức get để thực hiện router
        '/covid/:_id', // Bắt lấy path này
        isAuth, // Bảo vệ router
        CovidController.getIndex // Lấy function getIndex để xử lý router
    )
;
// Tương tự với các router còn lại
router.post('/post-vaccine', isAuth, CovidController.postVaccine);
router.post('/post-xn', isAuth, CovidController.postXN);
router.post('/post-nd', isAuth, CovidController.postND);

module.exports = router;