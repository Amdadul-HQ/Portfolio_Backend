"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsValidation = void 0;
const zod_1 = require("zod");
// z.string().url() alone accepts any scheme (e.g. "javascript:", "data:"), which would then
// render as a live, clickable <a href> on the public hero section — restrict to http(s) links.
const httpUrl = zod_1.z
    .string()
    .url('resumeLink must be a valid URL')
    .refine((val) => /^https?:\/\//i.test(val), {
    message: 'resumeLink must start with http:// or https://',
});
const updateSettingsSchema = zod_1.z.object({
    body: zod_1.z.object({
        resumeLink: zod_1.z.union([httpUrl, zod_1.z.literal('')]),
    }),
});
exports.SettingsValidation = {
    updateSettingsSchema,
};
