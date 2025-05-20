"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../../modules/auth/auth.routes");
const blogs_routes_1 = require("../../modules/blogs/blogs.routes");
const projects_routes_1 = require("../../modules/projects/projects.routes");
const skills_routes_1 = require("../../modules/skills/skills.routes");
const experience_routes_1 = require("../../modules/experience/experience.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes
    },
    {
        path: '/blogs',
        route: blogs_routes_1.BlogRoutes
    },
    {
        path: "/projects",
        route: projects_routes_1.ProjectRoutes
    },
    {
        path: "/skills",
        route: skills_routes_1.SkillRoutes
    },
    {
        path: "/experience",
        route: experience_routes_1.ExperienceRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
