"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = require("../../app/middleWares/validationRequest");
const auth_1 = __importDefault(require("../../app/middleWares/auth"));
const client_1 = require("@prisma/client");
const multer_config_1 = require("../../app/config/multer-config");
const experience_validation_1 = require("./experience.validation");
const experience_controller_1 = require("./experience.controller");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationRequest_1.validateRequest)(experience_validation_1.ExperienceValidation.createExperienceZodSchema), experience_controller_1.ExperienceController.createExperience);
router.get('/', experience_controller_1.ExperienceController.getAllExperience);
router.get('/:id', experience_controller_1.ExperienceController.getExperienceDetails);
router.patch('/update/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationRequest_1.validateRequest)(experience_validation_1.ExperienceValidation.updateExperienceZodSchema), experience_controller_1.ExperienceController.updateExperience);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), experience_controller_1.ExperienceController.deleteExperience);
exports.ExperienceRoutes = router;
