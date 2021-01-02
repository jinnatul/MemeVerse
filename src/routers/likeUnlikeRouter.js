import express from 'express';
import {
  likePost,
  unLikePost,
} from '../controllers/likeUnlikeController';

const router = express.Router();

router.post('/like/:pid/:uid', likePost);
router.post('/unlike/:pid/:uid', unLikePost);

export default router;
