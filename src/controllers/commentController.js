import catchAsync from '../middlewares/catchAsync';
import AppError from '../../utils/AppError';
import Comment from '../models/Comment';
import Post from '../models/Post';
import sendData from '../../utils/response/sendData';
import sendMessage from '../../utils/response/sendMessage';

export const createComment = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const postId = req.params.pid;

  const { text } = req.body;

  if (!text) return next(new AppError('Provide comment text.', 400));

  const commentInfo = await Comment.create(req.body);

  if (!commentInfo) {
    return sendMessage(res, 400, 'failed', 'somthing wrong.');
  }

  // create relation between post and comment
  await Post.findOne({
    _id: postId,
  }, (err, data) => {
    if (data) {
      data.comments.push(commentInfo._id);
      data.save();
    }
  });
  return sendData(res, commentInfo);
});

// remove comments
export const removeComment = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const postId = req.params.pid;
  const commentId = req.params.cid;
  const userId = req.params.uid;

  // create relation between post and comment
  const commentInfo = await Comment.findOneAndDelete({ _id: commentId, user: userId });
  if (commentInfo) {
    await Post.findOne({
      _id: postId,
    }, async (err, data) => {
      if (data) {
        const { comments } = data;
        const position = comments.indexOf(commentId);
        if (position !== -1) {
          comments.splice(position, 1);
          data.save();
        }
        return sendMessage(res, 200, 'ok', 'comment remove successfully.');
      }
    });
  }
  return next(new AppError('comment not found.', 404));
});
