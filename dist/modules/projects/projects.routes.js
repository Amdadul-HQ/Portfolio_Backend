"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = require("../../app/middleWares/validationRequest");
const auth_1 = __importDefault(require("../../app/middleWares/auth"));
const client_1 = require("@prisma/client");
const multer_config_1 = require("../../app/config/multer-config");
const projects_validation_1 = require("./projects.validation");
const projects_controller_1 = require("./projects.controller");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationRequest_1.validateRequest)(projects_validation_1.ProjectValidation.createProjectZodSchema), projects_controller_1.ProjectController.createProject);
router.get('/', projects_controller_1.ProjectController.getAllProjects);
router.get('/:id', projects_controller_1.ProjectController.getProjectDetails);
router.patch('/update/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationRequest_1.validateRequest)(projects_validation_1.ProjectValidation.updateProjectZodSchema), projects_controller_1.ProjectController.updateProject);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), projects_controller_1.ProjectController.deleteProject);
exports.ProjectRoutes = router;
