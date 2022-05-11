const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
    '/login',
    [
        body('staffId', 'ID has to be valid.').isLength({ min: 3 }).isAlphanumeric().trim(), // Xac thuc Id
        body(
            'password',
            'Password has to be valid.' // Xác thực pass phù hợp điều kiện
        ).isLength({ min: 3 }).isAlphanumeric().trim()
    ],
    authController.postLogin
);
router.post('/logout', authController.postLogout);

module.exports = router;