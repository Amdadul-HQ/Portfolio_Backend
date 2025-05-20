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
exports.ExperienceController = void 0;
const catchAsync_1 = require("../../app/helper/catchAsync");
const sendResponse_1 = require("../../app/shared/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const experience_service_1 = require("./experience.service");
const createExperience = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new Error('Image file is required');
    }
    const userId = req.user.id;
    const expData = Object.assign(Object.assign({}, req.body), { companyImage: file.path });
    const result = yield experience_service_1.ExperienceService.createExperience(expData, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Blog created successfully',
        data: result,
    });
}));
const getExperienceDetails = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield experience_service_1.ExperienceService.getExperienceDetails(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Experience retrieved successfully',
        data: result,
    });
}));
const getAllExperience = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield experience_service_1.ExperienceService.getAllExperience();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Experience retrieved successfully',
        data: result,
    });
}));
const updateExperience = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    const userId = req.user.id;
    const expData = Object.assign(Object.assign({}, req.body), { userId, companyImage: file === null || file === void 0 ? void 0 : file.path });
    const result = yield experience_service_1.ExperienceService.updateExperience(id, expData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Experience updated successfully',
        data: result,
    });
}));
const deleteExperience = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield experience_service_1.ExperienceService.deleteExperience(id);
    if (result) {
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Experience Deleted successfully',
            data: null,
        });
    }
}));
exports.ExperienceController = {
    createExperience,
    getAllExperience,
    updateExperience,
    deleteExperience,
    getExperienceDetails
};
