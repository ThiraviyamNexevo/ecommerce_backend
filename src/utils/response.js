// ✅ Common response helper
exports.success = (res, message = "Success", data = null, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

exports.error = (res, message = "Something went wrong", status = 500, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};
