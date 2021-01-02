import express from 'express';
import {
  createPost,
  getPosts,
  getSinglePost,
} from '../controllers/postController';

const router = express.Router();

router.post('/:uid', createPost);
router.get('/', getPosts);
router.get('/:id', getSinglePost);

export default router;
