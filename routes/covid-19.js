const express = require('express');

const covid = require('../controllers/covid-19');

const router = express.Router();

router.get('/covid/:staffId', covid.getIndex);
router.post('/post-vaccine', covid.postVaccine);
router.post('/post-xn', covid.postXN);
router.post('/post-nd', covid.postND);

module.exports = router;