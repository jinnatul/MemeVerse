import AppError from '../../utils/AppError';
import catchAsync from '../middlewares/catchAsync';
import sendData from '../../utils/response/sendData';

// Create One
export const createOne = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const modelName = Model.collection.collectionName;
  console.log(modelName);
  switch (modelName) {
    case '': {
      if (!req.body.brandName) {
        return next(new AppError(''), 400);
      }
      break;
    }
    default: {
      break;
    }
  }

  const body = {
    ...req.body,
    lastModified: Date.now(),
  };

  const data = await Model.create(body);
  return sendData(res, data);
});

// Get All
export const getAll = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const docs = await Model.find();
  const modelName = Model.collection.collectionName;
  switch (modelName) {
    case 'posts': {
      for (let i = 0; i < docs.length; i += 1) {
        docs[i]._doc.likes = docs[i].likeCount.length;
        docs[i].likeCount = undefined;
      }
      return sendData(res, docs);
    }
    default: {
      return sendData(res, docs);
    }
  }
});

// Get One
export const getOne = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const doc = await Model.findById(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  const modelName = Model.collection.collectionName;
  switch (modelName) {
    case 'posts': {
      doc._doc.likes = doc.likeCount.length;
      doc.likeCount = undefined;
      return sendData(res, doc);
    }
    case 'users': {
      const { posts } = doc;
      for (let i = 0; i < posts.length; i += 1) {
        posts[i]._doc.likes = posts[i].likeCount.length;
        posts[i].likeCount = undefined;
      }
      return sendData(res, doc);
    }
    default: {
      return sendData(res, doc);
    }
  }
});

// Modify One
export const modifyOne = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const modelName = Model.collection.collectionName;

  switch (modelName) {
    case '': {
      const messages = 'ok';
      if (messages !== 'ok') {
        return next(new AppError(`${messages}`), 400);
      }
      break;
    }
    default: {
      break;
    }
  }

  const body = {
    ...req.body,
    lastModified: Date.now(),
  };

  const doc = await Model.findByIdAndUpdate(
    req.params.id,
    body, {
      new: true,
      runValidators: true,
    },
  );

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  return sendData(res, doc);
});
