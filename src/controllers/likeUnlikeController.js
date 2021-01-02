import catchAsync from '../middlewares/catchAsync';
import AppError from '../../utils/AppError';
import Post from '../models/Post';

export const likePost = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const postId = req.params.pid;
  const userId = req.params.uid;

  // create relation between post and comment
  await Post.findOne({
    _id: postId,
  }, (err, data) => {
    if (data) {
      const { likeCount } = data;
      if (likeCount.indexOf(userId) !== -1) {
        return next(new AppError('already liked.', 400));
      }
      likeCount.push(userId);
      data.save();
    }
    return res.json({
      message: 'liked',
    });
  });
});

export const unLikePost = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const postId = req.params.pid;
  const userId = req.params.uid;

  // create relation between post and comment
  await Post.findOne({
    _id: postId,
  }, (err, data) => {
    if (data) {
      const { likeCount } = data;
      const position = likeCount.indexOf(userId);
      if (position === -1) {
        return next(new AppError('first like this post.', 400));
      }
      likeCount.splice(position, 1);
      data.save();
    }
    return res.json({
      message: 'unliked',
    });
  });
});
