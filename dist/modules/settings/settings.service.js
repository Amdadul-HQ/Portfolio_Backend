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
exports.SettingsService = void 0;
const prisma_1 = __importDefault(require("../../app/shared/prisma"));
const getOrCreateSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.siteSettings.findFirst();
    if (existing)
        return existing;
    return prisma_1.default.siteSettings.create({ data: {} });
});
const getSettings = () => __awaiter(void 0, void 0, void 0, function* () { return getOrCreateSettings(); });
const updateSettings = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const s = yield getOrCreateSettings();
    return prisma_1.default.siteSettings.update({ where: { id: s.id }, data: payload });
});
exports.SettingsService = {
    getSettings,
    updateSettings,
};
