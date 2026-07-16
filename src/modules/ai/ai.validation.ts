import { z } from 'zod';

const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'message is required').max(2000),
    history: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })
      )
      .optional(),
  }),
});

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'name is required'),
    contact: z.string().optional(),
    message: z.string().min(1, 'message is required').max(3000),
  }),
});

const updateSettingSchema = z.object({
  body: z.object({
    context: z.string().optional(),
    persona: z.string().optional(),
    greeting: z.string().optional(),
    isEnabled: z.boolean().optional(),
  }),
});

export const AiValidation = { chatSchema, contactSchema, updateSettingSchema };
