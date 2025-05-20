"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = exports.createBlogZodSchema = void 0;
const zod_1 = require("zod");
exports.createBlogZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }),
        shortDescription: zod_1.z.string({
            required_error: 'Short Description is required',
        }),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }),
        isFeatured: zod_1.z.boolean().default(false),
        topic: zod_1.z.string({
            required_error: 'Topic is required',
        }),
        readingTime: zod_1.z.string({
            required_error: 'Reading Time is required',
        }),
        publishDate: zod_1.z.string({
            required_error: 'Publish Date & Time is required',
        }),
        category: zod_1.z.string({
            required_error: 'Category is required',
        }),
        brand: zod_1.z.array(zod_1.z.string({
            required_error: 'Each brand must be a string',
        }), {
            required_error: 'Brand is required',
        }),
    }),
});
const updateblogZodSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    shortDescription: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    isFeatured: zod_1.z.boolean().optional(),
    topic: zod_1.z.string().optional(),
    readingTime: zod_1.z.string().optional(),
    publishDate: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    brand: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.BlogValidation = {
    createBlogZodSchema: exports.createBlogZodSchema,
    updateblogZodSchema
};
