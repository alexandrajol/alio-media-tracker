// src/routes/mediaRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/mediaController');
const { validateMedia } = require('../validators/mediaValidator');

router.get('/statistics', controller.getStats);
router.get('/', controller.getMedia); 
router.post('/', validateMedia, controller.createMedia); 
router.get('/:id', controller.getMediaById);
router.patch('/:id/status', controller.updateMediaStatus);
router.put('/:id', validateMedia, controller.updateMedia);
router.delete('/:id', controller.deleteMedia);

module.exports = router;
