import httpStatus from 'http-status';
import { catchAsync } from '../../app/helper/catchAsync';
import { sendResponse } from '../../app/shared/sendResponse';
import { SettingsService } from './settings.service';

const getSettings = catchAsync(async (req, res) => {
  const result = await SettingsService.getSettings();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Site settings retrieved successfully',
    data: result,
  });
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await SettingsService.updateSettings(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Site settings updated successfully',
    data: result,
  });
});

export const SettingsController = {
  getSettings,
  updateSettings,
};
