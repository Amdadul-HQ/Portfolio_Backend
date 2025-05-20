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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const prisma_1 = __importDefault(require("../../app/shared/prisma"));
const paginationHelper_1 = require("../../app/helper/paginationHelper");
const blogs_constant_1 = require("./blogs.constant");
const createBlogIntoDB = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
    return result;
});
const getAllBlogs = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // Searchable fields
    if (searchTerm) {
        andConditions.push({
            OR: blogs_constant_1.blogSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // Other filters (dynamic)
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([key, value]) => ({
                [key]: {
                    equals: value,
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    // Fetch filtered and paginated blogs
    const [blogs, total] = yield prisma_1.default.$transaction([
        prisma_1.default.blog.findMany({
            where: whereConditions,
            include: {
                user: true,
            },
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { publishDate: 'desc' },
            skip,
            take: limit,
        }),
        prisma_1.default.blog.count({ where: whereConditions }),
    ]);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: blogs,
    };
});
const updateBlogIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.blog.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.blog.update({
        where: { id },
        data,
    });
    return result;
});
const getBlogDetailsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
});
const deleteBlogFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.delete({
        where: {
            id
        }
    });
    return result;
});
exports.BlogService = {
    createBlogIntoDB,
    getAllBlogs,
    updateBlogIntoDB,
    getBlogDetailsFromDB,
    deleteBlogFromDB
};
