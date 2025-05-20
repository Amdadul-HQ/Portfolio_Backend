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
exports.ProjectService = void 0;
const prisma_1 = __importDefault(require("../../app/shared/prisma"));
const paginationHelper_1 = require("../../app/helper/paginationHelper");
const projects_constant_1 = require("./projects.constant");
const createProjectInToDB = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.project.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
    return result;
});
const getAllProjectFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // Search term filter
    if (searchTerm) {
        andConditions.push({
            OR: projects_constant_1.projectSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // Other filters (remove undefined values)
    const cleanFilterData = {};
    Object.entries(filterData).forEach(([key, value]) => {
        if (value !== undefined) {
            cleanFilterData[key] = value;
        }
    });
    if (Object.keys(cleanFilterData).length > 0) {
        andConditions.push({
            AND: Object.entries(cleanFilterData).map(([key, value]) => ({
                [key]: {
                    equals: value,
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const allProjects = yield prisma_1.default.project.findMany({
        where: whereConditions,
        include: {
            user: true,
        },
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                projectStartDate: 'desc',
            },
    });
    const paginatedData = allProjects.slice(skip, skip + limit);
    return {
        meta: {
            page,
            limit,
            total: allProjects.length,
        },
        data: paginatedData, // FIX: unwrap array
    };
});
const getProjectDetailsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.project.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
});
const updateProjectInToDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.project.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.project.update({
        where: { id },
        data,
    });
    return result;
});
const deleteProjectFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.project.delete({
        where: {
            id
        }
    });
    return result;
});
exports.ProjectService = {
    createProjectInToDB,
    getAllProjectFromDB,
    getProjectDetailsFromDB,
    updateProjectInToDB,
    deleteProjectFromDB
};
