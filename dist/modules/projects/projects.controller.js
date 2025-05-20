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
exports.ProjectController = void 0;
const catchAsync_1 = require("../../app/helper/catchAsync");
const sendResponse_1 = require("../../app/shared/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const projects_service_1 = require("./projects.service");
const pick_1 = __importDefault(require("../../app/shared/pick"));
const projects_constant_1 = require("./projects.constant");
const createProject = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new Error('Image file is required');
    }
    const userId = req.user.id;
    const projectData = Object.assign(Object.assign({}, req.body), { siteMockup: file.path });
    const result = yield projects_service_1.ProjectService.createProjectInToDB(projectData, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Project created successfully',
        data: result,
    });
}));
const getAllProjects = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rawFilters = (0, pick_1.default)(req.query, projects_constant_1.projectFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const filters = {
        isFeatured: rawFilters.isFeatured === 'true'
            ? true
            : rawFilters.isFeatured === 'false'
                ? false
                : undefined,
        searchTerm: typeof rawFilters.searchTerm === 'string'
            ? rawFilters.searchTerm
            : undefined,
    };
    const result = yield projects_service_1.ProjectService.getAllProjectFromDB(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Projects retrieved successfully',
        meta: result.meta,
        data: result.data, // will be an array
    });
}));
const updateProject = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    const userId = req.user.id;
    const blogData = Object.assign(Object.assign({}, req.body), { userId, eventImgUrl: file === null || file === void 0 ? void 0 : file.path });
    const result = yield projects_service_1.ProjectService.updateProjectInToDB(id, blogData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Project updated successfully',
        data: result,
    });
}));
const getProjectDetails = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield projects_service_1.ProjectService.getProjectDetailsFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Project retrieved successfully',
        data: result,
    });
}));
const deleteProject = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield projects_service_1.ProjectService.deleteProjectFromDB(id);
    if (result) {
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Project Deleted successfully',
            data: null,
        });
    }
}));
exports.ProjectController = {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    getProjectDetails
};
