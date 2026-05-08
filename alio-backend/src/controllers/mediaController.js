// src/controllers/mediaController.js
const service = require('../services/mediaService');

exports.getMedia = (req, res) => {
    // Extract pagination query params, default to page 1, limit 10
    const { page, limit } = req.query;
    const result = service.getAll(page, limit);
    res.json(result);
};

exports.createMedia = (req, res) => {
    const newItem = service.create(req.body);
    res.status(201).json(newItem);
};

exports.getStats = (req, res) => {
    // Pass the requested type (e.g., Movie, Book, TV Show) to the service
    const stats = service.getStatistics(req.query.type);
    res.json(stats);
};

exports.getMediaById = (req, res) => {
    const item = service.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Media not found" });
    res.json(item);
};

exports.updateMedia = (req, res) => {
    // Note: You should ideally run validateMedia middleware on this route too!
    const updatedItem = service.update(req.params.id, req.body);
    if (!updatedItem) return res.status(404).json({ message: "Media not found" });
    res.json(updatedItem);
};

exports.deleteMedia = (req, res) => {
    const success = service.delete(req.params.id);
    if (!success) return res.status(404).json({ message: "Media not found" });
    res.status(204).send(); // 204 means "No Content" (successfully deleted)
};