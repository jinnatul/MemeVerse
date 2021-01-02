const sendData = (res, data) => {
  res.status(200).json({
    status: 'ok',
    data,
  });
};

export default sendData;
