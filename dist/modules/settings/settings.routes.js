"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = require("../../app/middleWares/validationRequest");
const auth_1 = __importDefault(require("../../app/middleWares/auth"));
const client_1 = require("@prisma/client");
const settings_controller_1 = require("./settings.controller");
const settings_validation_1 = require("./settings.validation");
const router = express_1.default.Router();
// Public — the portfolio site reads this (e.g. the hero "Resume" button link)
router.get('/', settings_controller_1.SettingsController.getSettings);
// Admin — the dashboard "Settings" page
router.put('/', (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validationRequest_1.validateRequest)(settings_validation_1.SettingsValidation.updateSettingsSchema), settings_controller_1.SettingsController.updateSettings);
exports.SettingsRoutes = router;
