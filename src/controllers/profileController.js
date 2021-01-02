import bcrypt from 'bcryptjs';
import catchAsync from '../middlewares/catchAsync';
import AppError from '../../utils/AppError';
import User from '../models/User';
import sendEmailOTP from '../../config/emailOTP';
import sendMessage from '../../utils/response/sendMessage';
import {
  getOne,
} from './handlerFactory';

export const getProfiles = getOne(User);

// forgot password request then send a OTP to email
export const forgotPassword = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const { email } = req.body;

  if (!email) return next(new AppError('Provide your email.', 400));

  const userInfo = await User.findOne({ email });
  if (!userInfo) return next(new AppError('user not found.', 400));

  const otpInfo = await sendEmailOTP(email);

  // save OTP information
  await User.findOne({
    _id: userInfo._id,
  }, (err, data) => {
    if (data) {
      data.otp = otpInfo.OTP;
      data.createdAtOTP = otpInfo.createdAtOTP;
      data.save();
    }
  });

  return sendMessage(res, 200, 'ok', `Send an OTP code to ${email}`);
});

// OTP verification
export const verifyOTP = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    otp,
    email,
  } = req.body;

  const userInfo = await User.findOne({
    email,
    otp,
  }).select('createdAtOTP');

  if (!userInfo) next(new AppError('Provide valid verification code.', 400));

  const currentTime = new Date();
  const difference = currentTime - userInfo.createdAtOTP;
  if (difference > 300000) return next(new AppError('Expire OTP code.', 403));

  return sendMessage(res, 200, 'ok', 'verification success');
});

// after otp verification, finally change password
export const changePassword = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    email,
    password,
  } = req.body;

  if (!email) return next(new AppError('Provide your email.', 400));
  if (!password) return next(new AppError('Provide your password.', 400));

  const userInfo = await User.findOne({ email }).select('+password');
  if (!userInfo) {
    return next(new AppError('user not found.', 404));
  }

  await User.findOne({
    email,
  }, async (err, data) => {
    if (data) {
      data.password = await bcrypt.hash(password, 12);
      data.save();
    }
  });
  return sendMessage(res, 200, 'ok', 'password change successfully.');
});