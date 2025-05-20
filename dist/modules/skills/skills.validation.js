"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsValidation = void 0;
const zod_1 = require("zod");
const createSkillZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        field: zod_1.z.enum(['FRONTEND', 'BACKEND', 'DEVOPS', 'TOOL'], {
            required_error: 'Field is required and must be one of FRONTEND, BACKEND, DEVOPS, TOOL',
        }),
        name: zod_1.z.string({
            required_error: 'Skill name is required',
        }),
    }),
});
const updateSkillZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        field: zod_1.z.enum(['FRONTEND', 'BACKEND', 'DEVOPS', 'TOOL']).optional(),
        name: zod_1.z.string().optional(),
    }),
});
exports.SkillsValidation = {
    createSkillZodSchema,
    updateSkillZodSchema
};
