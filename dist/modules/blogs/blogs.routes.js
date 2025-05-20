"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = require("../../app/middleWares/validationRequest");
const auth_1 = __importDefault(require("../../app/middleWares/auth"));
const client_1 = require("@prisma/client");
const multer_config_1 = require("../../app/config/multer-config");
const blogs_validation_1 = require("./blogs.validation");
const blogs_controller_1 = require("./blogs.controller");
const router = express_1.default.Router();
router.get('/', blogs_controller_1.BlogController.getBlogs);
router.post('/create', (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationRequest_1.validateRequest)(blogs_validation_1.BlogValidation.createBlogZodSchema), blogs_controller_1.BlogController.createBlog);
router.get('/:id', blogs_controller_1.BlogController.getBlogDetails);
router.patch('/update/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationRequest_1.validateRequest)(blogs_validation_1.BlogValidation.updateblogZodSchema), blogs_controller_1.BlogController.updateBlog);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), blogs_controller_1.BlogController.deleteBlog);
exports.BlogRoutes = router;
