import express from 'express';
import { validateRequest } from '../../app/middleWares/validationRequest';
import auth from '../../app/middleWares/auth';
import { UserRole } from '@prisma/client';
import { AiController } from './ai.controller';
import { AiValidation } from './ai.validation';

const router = express.Router();

// Public — the chat widget
router.get('/config', AiController.getConfig);
router.post('/chat', validateRequest(AiValidation.chatSchema), AiController.chat);
router.post('/contact', validateRequest(AiValidation.contactSchema), AiController.contact);

// Admin — the dashboard "AI Assistant" wizard
router.get('/settings', auth(UserRole.ADMIN), AiController.getSetting);
router.put(
  '/settings',
  auth(UserRole.ADMIN),
  validateRequest(AiValidation.updateSettingSchema),
  AiController.updateSetting
);

export const AiRoutes = router;
