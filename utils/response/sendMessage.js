const sendMessage = (res, statusCode, type, message) => {
  res.status(statusCode).json({
    status: type,
    message,
  });
};

export default sendMessage;
