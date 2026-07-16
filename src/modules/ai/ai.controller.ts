import httpStatus from 'http-status';
import { catchAsync } from '../../app/helper/catchAsync';
import { sendResponse } from '../../app/shared/sendResponse';
import { AiService } from './ai.service';

const chat = catchAsync(async (req, res) => {
  const result = await AiService.chat(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI reply generated',
    data: result,
  });
});

const contact = catchAsync(async (req, res) => {
  const result = await AiService.contact(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message delivered',
    data: result,
  });
});

const getConfig = catchAsync(async (req, res) => {
  const result = await AiService.getPublicConfig();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI config retrieved',
    data: result,
  });
});

const getSetting = catchAsync(async (req, res) => {
  const result = await AiService.getSetting();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI settings retrieved',
    data: result,
  });
});

const updateSetting = catchAsync(async (req, res) => {
  const result = await AiService.updateSetting(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI settings updated',
    data: result,
  });
});

export const AiController = { chat, contact, getConfig, getSetting, updateSetting };
