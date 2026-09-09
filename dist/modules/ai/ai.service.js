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
exports.AiService = void 0;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = __importDefault(require("../../app/shared/prisma"));
const config_1 = __importDefault(require("../../app/config"));
const DEFAULT_PERSONA = "You are the friendly AI assistant on Amdadul HQ's developer portfolio website. " +
    "Answer visitors' questions about Amdadul — his skills, projects, experience, and how to work with him — using ONLY the context provided below. " +
    "Keep answers concise, warm, and helpful. If something isn't in the context, say you're not sure and offer to connect the visitor with Amdadul directly. " +
    'When a visitor wants to hire, collaborate, or leave a message, use the contact_owner tool to forward it to him.';
// True only when a real Google Gemini (AI Studio) key is present — keys start with "AIza".
const isConfigured = () => !!config_1.default.gemini_api_key &&
    config_1.default.gemini_api_key.startsWith('AIza') &&
    !config_1.default.gemini_api_key.toLowerCase().includes('your') &&
    config_1.default.gemini_api_key.length > 30;
const getOrCreateSetting = () => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.aiSetting.findFirst();
    if (existing)
        return existing;
    return prisma_1.default.aiSetting.create({ data: {} });
});
const getPublicConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const s = yield getOrCreateSetting();
    return { greeting: s.greeting, isEnabled: s.isEnabled, configured: isConfigured() };
});
const getSetting = () => __awaiter(void 0, void 0, void 0, function* () { return getOrCreateSetting(); });
const updateSetting = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const s = yield getOrCreateSetting();
    return prisma_1.default.aiSetting.update({ where: { id: s.id }, data: payload });
});
const sendTelegram = (text) => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.telegram_bot_token || !config_1.default.telegram_chat_id) {
        throw new Error('Telegram is not configured');
    }
    yield axios_1.default.post(`https://api.telegram.org/bot${config_1.default.telegram_bot_token}/sendMessage`, {
        chat_id: config_1.default.telegram_chat_id,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    });
});
// Gemini function-calling declaration for the "contact me" action.
const contactFn = {
    name: 'contact_owner',
    description: "Forward the visitor's message to Amdadul directly via his Telegram DM. " +
        'Call this ONLY when the visitor explicitly wants to get in touch, hire, collaborate, or leave a message for Amdadul. ' +
        'If their name or a way to reach them back is missing, ask for it first, then call this tool.',
    parameters: {
        type: 'object',
        properties: {
            name: { type: 'string', description: "The visitor's name" },
            contact: {
                type: 'string',
                description: "The visitor's email or handle so Amdadul can reply back",
            },
            message: { type: 'string', description: 'The message to forward to Amdadul' },
        },
        required: ['name', 'message'],
    },
};
const textFromGemini = (data) => {
    var _a, _b, _c;
    return (((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) || [])
        .filter((p) => typeof p.text === 'string')
        .map((p) => p.text)
        .join('\n')
        .trim();
};
const chat = (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, history = [], }) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    const setting = yield getOrCreateSetting();
    if (!setting.isEnabled) {
        return {
            reply: 'The AI assistant is currently turned off. Please use the contact page to reach Amdadul.',
            contacted: false,
        };
    }
    if (!isConfigured()) {
        return {
            reply: "The AI assistant isn't fully set up yet (the API key is missing). Please check back soon, or use the contact page to reach Amdadul directly.",
            contacted: false,
        };
    }
    const system = `${((_b = setting.persona) === null || _b === void 0 ? void 0 : _b.trim()) || DEFAULT_PERSONA}\n\n` +
        `--- CONTEXT ABOUT AMDADUL ---\n${((_c = setting.context) === null || _c === void 0 ? void 0 : _c.trim()) || '(No context has been provided yet.)'}`;
    const systemInstruction = { parts: [{ text: system }] };
    const tools = [{ functionDeclarations: [contactFn] }];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config_1.default.gemini_model}:generateContent?key=${config_1.default.gemini_api_key}`;
    const contents = (history || [])
        .filter((h) => h &&
        (h.role === 'user' || h.role === 'assistant') &&
        typeof h.content === 'string' &&
        h.content.trim().length > 0)
        .slice(-10)
        .map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });
    // Call Gemini. If the function-calling schema is ever rejected, fall back to a
    // plain (tool-less) call so basic Q&A always works.
    const generate = (body) => __awaiter(void 0, void 0, void 0, function* () { return (yield axios_1.default.post(url, body, { timeout: 30000 })).data; });
    const baseGen = { maxOutputTokens: 700, temperature: 0.7 };
    try {
        let data;
        try {
            data = yield generate({ systemInstruction, contents, tools, generationConfig: baseGen });
        }
        catch (toolErr) {
            // eslint-disable-next-line no-console
            console.error('[AI chat] tool call rejected, retrying without tools:', ((_d = toolErr === null || toolErr === void 0 ? void 0 : toolErr.response) === null || _d === void 0 ? void 0 : _d.data) || (toolErr === null || toolErr === void 0 ? void 0 : toolErr.message));
            data = yield generate({ systemInstruction, contents, generationConfig: baseGen });
        }
        const parts = ((_g = (_f = (_e = data === null || data === void 0 ? void 0 : data.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) || [];
        const fnCall = (_h = parts.find((p) => p.functionCall)) === null || _h === void 0 ? void 0 : _h.functionCall;
        if (fnCall && fnCall.name === 'contact_owner') {
            const input = (fnCall.args || {});
            let contacted = false;
            let toolResultText = '';
            try {
                yield sendTelegram('📬 <b>New message from your portfolio AI chat</b>\n\n' +
                    `<b>Name:</b> ${input.name || 'Anonymous'}\n` +
                    `<b>Contact:</b> ${input.contact || 'not provided'}\n\n` +
                    `<b>Message:</b>\n${input.message || message}`);
                contacted = true;
                toolResultText =
                    "Delivered to Amdadul's Telegram. He'll get back to the visitor soon.";
            }
            catch (_k) {
                toolResultText =
                    'Could not deliver via Telegram (contact channel not configured). Politely ask the visitor to email Amdadul instead.';
            }
            const followupContents = [
                ...contents,
                { role: 'model', parts: [{ functionCall: fnCall }] },
                {
                    role: 'user',
                    parts: [
                        {
                            functionResponse: {
                                name: 'contact_owner',
                                response: { result: toolResultText },
                            },
                        },
                    ],
                },
            ];
            const { data: d2 } = yield axios_1.default.post(url, {
                systemInstruction,
                contents: followupContents,
                tools,
                generationConfig: { maxOutputTokens: 400 },
            }, { timeout: 30000 });
            const reply = textFromGemini(d2) ||
                (contacted ? "Thanks! I've forwarded your message to Amdadul." : '');
            return { reply, contacted };
        }
        return {
            reply: textFromGemini(data) || "Sorry, I couldn't generate a response. Try rephrasing?",
            contacted: false,
        };
    }
    catch (err) {
        // Graceful failure — never 500 the widget. Log details for debugging.
        // eslint-disable-next-line no-console
        console.error('[AI chat] Gemini error:', ((_j = err === null || err === void 0 ? void 0 : err.response) === null || _j === void 0 ? void 0 : _j.data) || (err === null || err === void 0 ? void 0 : err.message));
        return {
            reply: "I'm having trouble reaching the AI right now. Please try again in a moment, or use the contact page to reach Amdadul.",
            contacted: false,
        };
    }
});
const contact = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, contact, message, }) {
    yield sendTelegram('📬 <b>New contact from your portfolio</b>\n\n' +
        `<b>Name:</b> ${name}\n` +
        `<b>Contact:</b> ${contact || 'not provided'}\n\n` +
        `<b>Message:</b>\n${message}`);
    return { delivered: true };
});
exports.AiService = {
    getPublicConfig,
    getSetting,
    updateSetting,
    chat,
    contact,
};
