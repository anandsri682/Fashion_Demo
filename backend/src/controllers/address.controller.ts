import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { Address } from '../models/Address';
import { ApiError } from '../utils/ApiError';

export const createAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  if (req.body.isDefault) {
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
  }

  const address = await Address.create({ ...req.body, user: userId });
  sendSuccess(res, 201, 'Address created successfully', { address });
});

export const listAddresses = catchAsync(async (req: Request, res: Response) => {
  const addresses = await Address.find({ user: req.user!._id }).sort({ isDefault: -1, createdAt: -1 });
  sendSuccess(res, 200, 'Addresses fetched', { addresses });
});

export const getAddress = catchAsync(async (req: Request, res: Response) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user!._id });
  if (!address) throw ApiError.notFound('Address not found', 'ADDRESS_NOT_FOUND');
  sendSuccess(res, 200, 'Address fetched', { address });
});

export const updateAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const address = await Address.findOne({ _id: req.params.id, user: userId });
  if (!address) throw ApiError.notFound('Address not found', 'ADDRESS_NOT_FOUND');

  if (req.body.isDefault) {
    await Address.updateMany({ user: userId, _id: { $ne: address._id } }, { $set: { isDefault: false } });
  }

  Object.assign(address, req.body);
  await address.save();
  sendSuccess(res, 200, 'Address updated successfully', { address });
});

export const deleteAddress = catchAsync(async (req: Request, res: Response) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user!._id });
  if (!address) throw ApiError.notFound('Address not found', 'ADDRESS_NOT_FOUND');
  sendSuccess(res, 200, 'Address deleted successfully');
});
