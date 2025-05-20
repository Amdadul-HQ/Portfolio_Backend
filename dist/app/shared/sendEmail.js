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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (to_1, html_1, ...args_1) => __awaiter(void 0, [to_1, html_1, ...args_1], void 0, function* (to, html, subject = 'New Contact Message from Website', userEmail, userName) {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: config_1.default.env === 'production',
        auth: {
            user: config_1.default.email_user,
            pass: config_1.default.email_pass,
        },
    });
    yield transporter.sendMail({
        from: `"${userName}" <${config_1.default.email_user}>`, // display user's name
        replyTo: userEmail, // reply will go to the user
        to,
        subject,
        html,
    });
});
exports.sendEmail = sendEmail;
