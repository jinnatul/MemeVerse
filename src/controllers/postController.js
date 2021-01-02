import catchAsync from '../middlewares/catchAsync';
import User from '../models/User';
import Post from '../models/Post';
import AppError from '../../utils/AppError';
import sendData from '../../utils/response/sendData';
import {
  getOne,
  getAll,
} from './handlerFactory';

export const createPost = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const {
    name, pictureId, pictureURL,
  } = req.body;

  if (!name) return next(new AppError('Provide post name.', 400));
  if (!pictureId) return next(new AppError('Provide asset id.', 400));
  if (!pictureURL) return next(new AppError('Provide your asset url.', 400));

  const body = {
    ...req.body,
    user: userId,
  };

  const postInfo = await Post.create(body);

  if (!postInfo) {
    return next(new AppError('Somthing wrong.', 400));
  }

  // create relation between user and post
  await User.findOne({
    _id: userId,
  }, (err, data) => {
    if (data) {
      data.posts.push(postInfo._id);
      data.save();
    }
  });

  return sendData(res, postInfo);
});

export const getPosts = getAll(Post);
export const getSinglePost = getOne(Post);
