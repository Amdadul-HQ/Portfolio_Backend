import { z } from 'zod';

// z.string().url() alone accepts any scheme (e.g. "javascript:", "data:"), which would then
// render as a live, clickable <a href> on the public hero section — restrict to http(s) links.
const httpUrl = z
  .string()
  .url('resumeLink must be a valid URL')
  .refine((val) => /^https?:\/\//i.test(val), {
    message: 'resumeLink must start with http:// or https://',
  });

const updateSettingsSchema = z.object({
  body: z.object({
    resumeLink: z.union([httpUrl, z.literal('')]),
  }),
});

export const SettingsValidation = {
  updateSettingsSchema,
};
