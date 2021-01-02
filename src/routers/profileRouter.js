import express from 'express';
import {
  getProfiles,
  forgotPassword,
  verifyOTP,
  changePassword,
} from '../controllers/profileController';

const router = express.Router();

router.get('/:id', getProfiles);
router.post('/forgot', forgotPassword);
router.post('/forgot/otpverify', verifyOTP);
router.post('/forgot/changepassword', changePassword);

export default router;