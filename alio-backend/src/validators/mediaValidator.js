const { z } = require('zod');

const mediaSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    type: z.enum(["Movie", "Book", "TV Show"], {  
        errorMap: () => ({ message: "Type must be Movie, Book, or TV Show" })
    }),
    rating: z.number().min(1).max(5).optional(),
}).passthrough(); 

const validateMedia = (req, res, next) => {
    try {
        req.body = mediaSchema.parse(req.body);
        next();
    } catch (error) {
        res.status(400).json({ errors: error.issues || error.errors });
    }
};

module.exports = { validateMedia };
