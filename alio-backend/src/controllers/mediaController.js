const service = require('../services/mediaService');

exports.getMedia = async (req, res) => {
    try {
        // Await the database results
        const result = await service.getMedia(req.query, req.user.id);
        // Wrap in { data: ... } because MediaContext expects it!
        res.json({ data: result }); 
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.createMedia = async (req, res) => {
    try {
        const newItem = await service.addMedia(req.body, req.user.id);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: "Failed to create", error: error.message });
    }
};

exports.getStats = async (req, res) => {
    const stats = await service.getStatistics(req.query.type, req.user.id);
    res.json(stats);
};

exports.getMediaById = async (req, res) => {
    try {
        const item = await service.getMediaById(req.params.id, req.user.id);

        if (!item) {
            return res.status(404).json({ message: "Media not found" });
        }

        res.json(item);
    } catch (error) {
        res.status(400).json({ message: "Invalid media id", error: error.message });
    }
};

exports.updateMedia = async (req, res) => {
    try {
        const updatedItem = await service.updateMedia(req.params.id, req.body, req.user.id);
        res.json(updatedItem);
    } catch (error) {
        res.status(404).json({ message: "Media not found" });
    }
};

exports.deleteMedia = async (req, res) => {
    try {
        await service.deleteMedia(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: "Media not found" });
    }
};

exports.updateMediaStatus = async (req, res) => {
    try {
        const updatedItem = await service.updateMediaStatus(req.params.id, req.user.id, req.body);

        if (!updatedItem) {
            return res.status(404).json({ message: "Media not found" });
        }

        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: "Failed to update media status", error: error.message });
    }
};
