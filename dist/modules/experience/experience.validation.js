"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceValidation = void 0;
const zod_1 = require("zod");
const createExperienceZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.string({
            required_error: 'Role is required',
        }),
        company: zod_1.z.string({
            required_error: 'Company name is required',
        }),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }),
        skill: zod_1.z.array(zod_1.z.string({
            required_error: 'Each skill must be a string',
        }), {
            required_error: 'Skills are required',
        }),
        startDate: zod_1.z.string({
            required_error: 'Start date is required',
        }),
        endDate: zod_1.z.string({
            required_error: 'End date is required',
        }),
    }),
});
const updateExperienceZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.string().optional(),
        company: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        skill: zod_1.z.array(zod_1.z.string()).optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        userId: zod_1.z.string().optional(),
    }),
});
exports.ExperienceValidation = {
    createExperienceZodSchema,
    updateExperienceZodSchema
};
