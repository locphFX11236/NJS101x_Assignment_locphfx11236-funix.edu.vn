const express = require('express');

const CovidController = require('../controllers/covid');

const router = express.Router();

router.get('/covid/:_id', CovidController.getIndex);
// router.post('/post-vaccine', CovidController.postVaccine);
// router.post('/post-xn', CovidController.postXN);
// router.post('/post-nd', CovidController.postND);

module.exports = router;