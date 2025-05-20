"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillController = void 0;
const catchAsync_1 = require("../../app/helper/catchAsync");
const sendResponse_1 = require("../../app/shared/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const skills_service_1 = require("./skills.service");
const createSkills = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new Error('Image file is required');
    }
    const userId = req.user.id;
    const skillData = Object.assign(Object.assign({}, req.body), { image: file.path });
    const result = yield skills_service_1.SkillsService.createSkill(skillData, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Skill created successfully',
        data: result,
    });
}));
const getSkills = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield skills_service_1.SkillsService.getAllSkills();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Skills retrieved successfully',
        data: result,
    });
}));
const getSkillsDetails = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield skills_service_1.SkillsService.getSkillsDetails(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Skills retrieved successfully',
        data: result,
    });
}));
const updateSkill = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    const userId = req.user.id;
    const skillData = Object.assign(Object.assign({}, req.body), { userId, eventImgUrl: file === null || file === void 0 ? void 0 : file.path });
    const result = yield skills_service_1.SkillsService.updateSkillIntoDB(id, skillData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Skill updated successfully',
        data: result,
    });
}));
const deleteSkill = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield skills_service_1.SkillsService.deleteSkillFromDB(id);
    if (result) {
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Skill Deleted successfully',
            data: null,
        });
    }
}));
exports.SkillController = {
    createSkills,
    getSkills,
    updateSkill,
    deleteSkill,
    getSkillsDetails
};
