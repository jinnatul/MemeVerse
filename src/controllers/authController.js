import catchAsync from '../middlewares/catchAsync';
import AppError from '../../utils/AppError';
import User from '../models/User';
import sendSMS from '../../config/twilioSMS';
import sendEmailOTP from '../../config/emailOTP';
import sendData from '../../utils/response/sendData';
import {
  createJWT,
} from '../middlewares/jwtToken';

const sendMessage = (res, type, statusCode, message) => {
  res.status(statusCode).json({
    status: type,
    message,
  });
};

/* Phone verification */
// Registration
export const smsAuthentication = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    name,
    phone,
    password,
  } = req.body;
  if (!name) return next(new AppError('Provide your name.', 400));
  if (!phone) return next(new AppError('Provide your phone.', 400));
  if (!password) return next(new AppError('Provide your password.', 400));

  let userInfo = await User.findOne({
    phone,
  });
  if (userInfo) return next(new AppError('Already use this number.', 400));

  const otpInfo = await sendSMS(phone);
  const reqBody = {
    ...req.body,
    otp: otpInfo.OTP,
    createdAtOTP: otpInfo.createdAtOTP,
  };
  userInfo = await User.create(reqBody);
  if (!userInfo) return next(new AppError('Try again.'));
  return sendMessage(res, 'ok', 201, `Send an SMS verification code to ${phone}`);
});

// account verification
export const smsVerify = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    otp,
    phone,
  } = req.body;

  let userInfo = await User.findOne({
    phone,
    otp,
  }).select('createdAtOTP');

  if (!userInfo) next(new AppError('Provide valid verification code.', 400));

  const currentTime = new Date();
  const difference = currentTime - userInfo.createdAtOTP;
  if (difference > 300000) return next(new AppError('Expire SMS verification code.', 403));

  userInfo = await User.findByIdAndUpdate(userInfo._id, {
    active: true,
  }, {
    new: true,
    runValidators: true,
  });

  userInfo._doc.token = createJWT(userInfo._id);
  return sendData(res, userInfo);
});

// signin with phone
export const signInWithPhone = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    phone,
    password,
  } = req.body;

  if (!phone) return next(new AppError('Provide your phone.', 400));
  if (!password) return next(new AppError('Provide your password.', 400));

  // Check if user exists & password is correct
  const userInfo = await User.findOne({
    phone,
  }).select('+password');
  if (!userInfo || !(await userInfo.comparePassword(
    password,
    userInfo.password,
  ))) {
    next(new AppError('Incorrect crediantial.', 400));
  }

  userInfo._doc.token = createJWT(userInfo._id);
  userInfo.password = undefined;
  return sendData(res, userInfo);
});

/* Email verification */
// Registration
export const emailAuthentication = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    name,
    email,
    password,
  } = req.body;
  if (!name) return next(new AppError('Provide your name.', 400));
  if (!email) return next(new AppError('Provide your email.', 400));
  if (!password) return next(new AppError('Provide your password.', 400));

  let userInfo = await User.findOne({ email });
  if (userInfo) return next(new AppError('Already use this email.', 400));

  const otpInfo = await sendEmailOTP(email);
  const reqBody = {
    ...req.body,
    otp: otpInfo.OTP,
    createdAtOTP: otpInfo.createdAtOTP,
  };
  userInfo = await User.create(reqBody);
  if (!userInfo) return next(new AppError('Try again.'));
  return sendMessage(res, 'ok', 201, `Send an OTP code to ${email}`);
});

// account verification
export const emailVerify = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    otp,
    email,
  } = req.body;

  let userInfo = await User.findOne({
    email,
    otp,
  }).select('createdAtOTP');

  if (!userInfo) next(new AppError('Provide valid verification code.', 400));

  const currentTime = new Date();
  const difference = currentTime - userInfo.createdAtOTP;
  if (difference > 300000) return next(new AppError('Expire OTP code.', 403));

  userInfo = await User.findByIdAndUpdate(userInfo._id, {
    active: true,
  }, {
    new: true,
    runValidators: true,
  });

  userInfo._doc.token = createJWT(userInfo._id);
  return sendData(res, userInfo);
});

// signin with email
export const signInWithEmail = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    email,
    password,
  } = req.body;

  if (!email) return next(new AppError('Provide your email.', 400));
  if (!password) return next(new AppError('Provide your password.', 400));

  // Check if user exists & password is correct
  const userInfo = await User.findOne({
    email,
  }).select('+password');
  if (!userInfo || !(await userInfo.comparePassword(
    password,
    userInfo.password,
  ))) {
    next(new AppError('Incorrect crediantial.', 400));
  }

  userInfo._doc.token = createJWT(userInfo._id);
  userInfo.password = undefined;
  const { posts } = userInfo;
  for (let i = 0; i < posts.length; i += 1) {
    posts[i]._doc.likes = posts[i].likeCount.length;
    posts[i].likeCount = undefined;
  }
  return sendData(res, userInfo);
});
