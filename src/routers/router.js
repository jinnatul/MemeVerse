import express from 'express';
import authRouter from './authRouter';
import profileRouter from './profileRouter';
import postRouter from './postRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/posts', postRouter);

export default router;
