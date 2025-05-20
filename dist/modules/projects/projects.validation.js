"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidation = void 0;
const zod_1 = require("zod");
const createProjectZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Project name is required',
        }),
        description: zod_1.z.string({
            required_error: 'Project description is required',
        }),
        type: zod_1.z.string({
            required_error: 'Project type is required',
        }),
        liveLink: zod_1.z.string({
            required_error: 'Live link is required',
        }).url('Live link must be a valid URL'),
        gitHubLink: zod_1.z.string({
            required_error: 'GitHub link is required',
        }).url('GitHub link must be a valid URL'),
        projectStartDate: zod_1.z.string({
            required_error: 'Project start date is required',
        }),
        projectEndDate: zod_1.z.string({
            required_error: 'Project end date is required',
        }),
        elements: zod_1.z.number({
            required_error: 'Elements count is required',
        }),
        totalCode: zod_1.z.number({
            required_error: 'Total lines of code is required',
        }),
        isFeatured: zod_1.z.boolean().optional(),
        features: zod_1.z.array(zod_1.z.string({
            required_error: 'Each feature must be a string',
        }), {
            required_error: 'Features are required',
        }),
        services: zod_1.z.array(zod_1.z.string({
            required_error: 'Each service must be a string',
        }), {
            required_error: 'Services are required',
        }),
        techonology: zod_1.z.array(zod_1.z.string({
            required_error: 'Each technology must be a string',
        }), {
            required_error: 'Technology stack is required',
        }),
    }),
});
const updateProjectZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        type: zod_1.z.string().optional(),
        liveLink: zod_1.z.string().url('Live link must be a valid URL').optional(),
        gitHubLink: zod_1.z.string().url('GitHub link must be a valid URL').optional(),
        projectStartDate: zod_1.z.string().optional(),
        projectEndDate: zod_1.z.string().optional(),
        elements: zod_1.z.number().optional(),
        totalCode: zod_1.z.number().optional(),
        isFeatured: zod_1.z.boolean().optional(),
        features: zod_1.z.array(zod_1.z.string()).optional(),
        services: zod_1.z.array(zod_1.z.string()).optional(),
        techonology: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.ProjectValidation = {
    createProjectZodSchema,
    updateProjectZodSchema
};
