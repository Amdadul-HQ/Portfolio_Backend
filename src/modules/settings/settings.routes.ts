import express from 'express';
import { validateRequest } from '../../app/middleWares/validationRequest';
import auth from '../../app/middleWares/auth';
import { UserRole } from '@prisma/client';
import { SettingsController } from './settings.controller';
import { SettingsValidation } from './settings.validation';

const router = express.Router();

// Public — the portfolio site reads this (e.g. the hero "Resume" button link)
router.get('/', SettingsController.getSettings);

// Admin — the dashboard "Settings" page
router.put(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(SettingsValidation.updateSettingsSchema),
  SettingsController.updateSettings
);

export const SettingsRoutes = router;
