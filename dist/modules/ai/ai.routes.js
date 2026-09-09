"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = require("../../app/middleWares/validationRequest");
const auth_1 = __importDefault(require("../../app/middleWares/auth"));
const client_1 = require("@prisma/client");
const ai_controller_1 = require("./ai.controller");
const ai_validation_1 = require("./ai.validation");
const router = express_1.default.Router();
// Public — the chat widget
router.get('/config', ai_controller_1.AiController.getConfig);
router.post('/chat', (0, validationRequest_1.validateRequest)(ai_validation_1.AiValidation.chatSchema), ai_controller_1.AiController.chat);
router.post('/contact', (0, validationRequest_1.validateRequest)(ai_validation_1.AiValidation.contactSchema), ai_controller_1.AiController.contact);
// Admin — the dashboard "AI Assistant" wizard
router.get('/settings', (0, auth_1.default)(client_1.UserRole.ADMIN), ai_controller_1.AiController.getSetting);
router.put('/settings', (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validationRequest_1.validateRequest)(ai_validation_1.AiValidation.updateSettingSchema), ai_controller_1.AiController.updateSetting);
exports.AiRoutes = router;
