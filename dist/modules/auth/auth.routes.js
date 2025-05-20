"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = require("../../app/middleWares/validationRequest");
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post('/create', (0, validationRequest_1.validateRequest)(auth_validation_1.AuthValidation.createUserSchema), auth_controller_1.AuthController.createUser);
router.post('/login', (0, validationRequest_1.validateRequest)(auth_validation_1.AuthValidation.loginUserSchema), auth_controller_1.AuthController.logingUser);
router.post('/refesh-token', auth_controller_1.AuthController.refeshToken);
exports.AuthRoutes = router;
