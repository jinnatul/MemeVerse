import express from 'express';
import {
  createComment,
  removeComment,
} from '../controllers/commentController';

const router = express.Router();

router.post('/comments/:pid', createComment);
router.delete('/comments/:pid/:cid/:uid', removeComment);

export default router;
