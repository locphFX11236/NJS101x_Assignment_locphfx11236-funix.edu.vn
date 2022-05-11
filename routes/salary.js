// const express = require('express');

// const salaryController = require('../controllers/salary'); // Liên kết với file controler xử lý hoạt động router
// const isAuth = require('../middleware/is-auth'); // Liên kết với Middleware

// const router = express.Router();

// router
//     .get( // Sử dụng phương thức get để thực hiện router
//         '/salary/:_id', // Bắt lấy path này
//         isAuth, // Bảo vệ router
//         salaryController.getIndex // Lấy function getIndex để xử lý router
//     )
// ;
// // Tương tự với các router còn lại
// router.post('/post-seach-month', isAuth, salaryController.seachMonth);

// module.exports = router;