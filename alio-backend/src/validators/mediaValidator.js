// src/validators/mediaValidator.js
const { z } = require('zod');

const mediaSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    type: z.enum(["Movie", "Book", "TV Show"], {  // <-- UPDATED THESE
        errorMap: () => ({ message: "Type must be Movie, Book, or TV Show" })
    }),
    rating: z.number().min(1).max(5).optional(),
    // We can also let the other fields pass through without strict validation for now
}).passthrough(); // <-- ADD THIS to allow the other fields (posterUrl, director, etc.) without throwing an error

const validateMedia = (req, res, next) => {
    try {
        req.body = mediaSchema.parse(req.body);
        next();
    } catch (error) {
        res.status(400).json({ errors: error.errors });
    }
};

module.exports = { validateMedia };