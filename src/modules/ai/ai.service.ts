import axios from 'axios';
import prisma from '../../app/shared/prisma';
import config from '../../app/config';

const DEFAULT_PERSONA =
  "You are the friendly AI assistant on Amdadul HQ's developer portfolio website. " +
  "Answer visitors' questions about Amdadul — his skills, projects, experience, and how to work with him — using ONLY the context provided below. " +
  "Keep answers concise, warm, and helpful. If something isn't in the context, say you're not sure and offer to connect the visitor with Amdadul directly. " +
  'When a visitor wants to hire, collaborate, or leave a message, use the contact_owner tool to forward it to him.';

// True only when a real Google Gemini (AI Studio) key is present — keys start with "AIza".
const isConfigured = (): boolean =>
  !!config.gemini_api_key &&
  config.gemini_api_key.startsWith('AIza') &&
  !config.gemini_api_key.toLowerCase().includes('your') &&
  config.gemini_api_key.length > 30;

const getOrCreateSetting = async () => {
  const existing = await prisma.aiSetting.findFirst();
  if (existing) return existing;
  return prisma.aiSetting.create({ data: {} });
};

const getPublicConfig = async () => {
  const s = await getOrCreateSetting();
  return { greeting: s.greeting, isEnabled: s.isEnabled, configured: isConfigured() };
};

const getSetting = async () => getOrCreateSetting();

const updateSetting = async (
  payload: Partial<{ context: string; persona: string; greeting: string; isEnabled: boolean }>
) => {
  const s = await getOrCreateSetting();
  return prisma.aiSetting.update({ where: { id: s.id }, data: payload });
};

const sendTelegram = async (text: string) => {
  if (!config.telegram_bot_token || !config.telegram_chat_id) {
    throw new Error('Telegram is not configured');
  }
  await axios.post(
    `https://api.telegram.org/bot${config.telegram_bot_token}/sendMessage`,
    {
      chat_id: config.telegram_chat_id,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }
  );
};

// Gemini function-calling declaration for the "contact me" action.
const contactFn = {
  name: 'contact_owner',
  description:
    "Forward the visitor's message to Amdadul directly via his Telegram DM. " +
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

type ChatTurn = { role: 'user' | 'assistant'; content: string };

const textFromGemini = (data: any): string =>
  ((data?.candidates?.[0]?.content?.parts as any[]) || [])
    .filter((p) => typeof p.text === 'string')
    .map((p) => p.text)
    .join('\n')
    .trim();

const chat = async ({
  message,
  history = [],
}: {
  message: string;
  history?: ChatTurn[];
}): Promise<{ reply: string; contacted: boolean }> => {
  const setting = await getOrCreateSetting();

  if (!setting.isEnabled) {
    return {
      reply:
        'The AI assistant is currently turned off. Please use the contact page to reach Amdadul.',
      contacted: false,
    };
  }
  if (!isConfigured()) {
    return {
      reply:
        "The AI assistant isn't fully set up yet (the API key is missing). Please check back soon, or use the contact page to reach Amdadul directly.",
      contacted: false,
    };
  }

  const system =
    `${setting.persona?.trim() || DEFAULT_PERSONA}\n\n` +
    `--- CONTEXT ABOUT AMDADUL ---\n${setting.context?.trim() || '(No context has been provided yet.)'}`;
  const systemInstruction = { parts: [{ text: system }] };
  const tools = [{ functionDeclarations: [contactFn] }];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini_model}:generateContent?key=${config.gemini_api_key}`;

  const contents: any[] = (history || [])
    .filter(
      (h) =>
        h &&
        (h.role === 'user' || h.role === 'assistant') &&
        typeof h.content === 'string' &&
        h.content.trim().length > 0
    )
    .slice(-10)
    .map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  // Call Gemini. If the function-calling schema is ever rejected, fall back to a
  // plain (tool-less) call so basic Q&A always works.
  const generate = async (body: any) => (await axios.post(url, body, { timeout: 30000 })).data;
  const baseGen = { maxOutputTokens: 700, temperature: 0.7 };

  try {
    let data: any;
    try {
      data = await generate({ systemInstruction, contents, tools, generationConfig: baseGen });
    } catch (toolErr: any) {
      // eslint-disable-next-line no-console
      console.error(
        '[AI chat] tool call rejected, retrying without tools:',
        toolErr?.response?.data || toolErr?.message
      );
      data = await generate({ systemInstruction, contents, generationConfig: baseGen });
    }

    const parts = (data?.candidates?.[0]?.content?.parts as any[]) || [];
    const fnCall = parts.find((p) => p.functionCall)?.functionCall;

    if (fnCall && fnCall.name === 'contact_owner') {
      const input = (fnCall.args || {}) as { name?: string; contact?: string; message?: string };
      let contacted = false;
      let toolResultText = '';
      try {
        await sendTelegram(
          '📬 <b>New message from your portfolio AI chat</b>\n\n' +
            `<b>Name:</b> ${input.name || 'Anonymous'}\n` +
            `<b>Contact:</b> ${input.contact || 'not provided'}\n\n` +
            `<b>Message:</b>\n${input.message || message}`
        );
        contacted = true;
        toolResultText =
          "Delivered to Amdadul's Telegram. He'll get back to the visitor soon.";
      } catch {
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

      const { data: d2 } = await axios.post(
        url,
        {
          systemInstruction,
          contents: followupContents,
          tools,
          generationConfig: { maxOutputTokens: 400 },
        },
        { timeout: 30000 }
      );

      const reply =
        textFromGemini(d2) ||
        (contacted ? "Thanks! I've forwarded your message to Amdadul." : '');
      return { reply, contacted };
    }

    return {
      reply: textFromGemini(data) || "Sorry, I couldn't generate a response. Try rephrasing?",
      contacted: false,
    };
  } catch (err: any) {
    // Graceful failure — never 500 the widget. Log details for debugging.
    // eslint-disable-next-line no-console
    console.error('[AI chat] Gemini error:', err?.response?.data || err?.message);
    return {
      reply:
        "I'm having trouble reaching the AI right now. Please try again in a moment, or use the contact page to reach Amdadul.",
      contacted: false,
    };
  }
};

const contact = async ({
  name,
  contact,
  message,
}: {
  name: string;
  contact?: string;
  message: string;
}) => {
  await sendTelegram(
    '📬 <b>New contact from your portfolio</b>\n\n' +
      `<b>Name:</b> ${name}\n` +
      `<b>Contact:</b> ${contact || 'not provided'}\n\n` +
      `<b>Message:</b>\n${message}`
  );
  return { delivered: true };
};

export const AiService = {
  getPublicConfig,
  getSetting,
  updateSetting,
  chat,
  contact,
};
