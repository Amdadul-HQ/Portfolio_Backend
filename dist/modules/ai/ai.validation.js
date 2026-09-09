"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiValidation = void 0;
const zod_1 = require("zod");
const chatSchema = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string().min(1, 'message is required').max(2000),
        history: zod_1.z
            .array(zod_1.z.object({
            role: zod_1.z.enum(['user', 'assistant']),
            content: zod_1.z.string(),
        }))
            .optional(),
    }),
});
const contactSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'name is required'),
        contact: zod_1.z.string().optional(),
        message: zod_1.z.string().min(1, 'message is required').max(3000),
    }),
});
const updateSettingSchema = zod_1.z.object({
    body: zod_1.z.object({
        context: zod_1.z.string().optional(),
        persona: zod_1.z.string().optional(),
        greeting: zod_1.z.string().optional(),
        isEnabled: zod_1.z.boolean().optional(),
    }),
});
exports.AiValidation = { chatSchema, contactSchema, updateSettingSchema };
