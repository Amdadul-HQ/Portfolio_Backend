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
exports.BlogController = void 0;
const catchAsync_1 = require("../../app/helper/catchAsync");
const sendResponse_1 = require("../../app/shared/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const blogs_service_1 = require("./blogs.service");
const pick_1 = __importDefault(require("../../app/shared/pick"));
const blogs_constant_1 = require("./blogs.constant");
const createBlog = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new Error('Image file is required');
    }
    const userId = req.user.id;
    const blogData = Object.assign(Object.assign({}, req.body), { thumbnail: file.path });
    const result = yield blogs_service_1.BlogService.createBlogIntoDB(blogData, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Blog created successfully',
        data: result,
    });
}));
const getBlogs = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rawFilters = (0, pick_1.default)(req.query, blogs_constant_1.blogFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    // const user = req.user;
    // Handle boolean conversion for 'isPublic' and 'isPaid' and ensure other filters are correctly handled
    const filters = {
        isFeatured: rawFilters.isFeatured === 'true' ? true : rawFilters.isFeatured === 'false' ? false : undefined,
        searchTerm: typeof rawFilters.searchTerm === 'string' ? rawFilters.searchTerm : undefined,
    };
    // If filters are empty, set them to undefined to fetch all events
    if (Object.keys(filters).length === 0 ||
        Object.values(filters).every((value) => value === undefined)) {
        filters.isFeatured = undefined;
        filters.searchTerm = undefined;
    }
    const result = yield blogs_service_1.BlogService.getAllBlogs(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Blog retrieved successfully',
        meta: result.meta,
        data: result.data, // already the blog array
    });
}));
const updateBlog = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    const userId = req.user.id;
    const blogData = Object.assign(Object.assign({}, req.body), { userId, eventImgUrl: file === null || file === void 0 ? void 0 : file.path });
    const result = yield blogs_service_1.BlogService.updateBlogIntoDB(id, blogData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Blog updated successfully',
        data: result,
    });
}));
const getBlogDetails = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield blogs_service_1.BlogService.getBlogDetailsFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Blog retrieved successfully',
        data: result,
    });
}));
const deleteBlog = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield blogs_service_1.BlogService.deleteBlogFromDB(id);
    if (result) {
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Blog Deleted successfully',
            data: null,
        });
    }
}));
exports.BlogController = {
    createBlog,
    getBlogs,
    updateBlog,
    getBlogDetails,
    deleteBlog
};
