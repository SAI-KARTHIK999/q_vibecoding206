function notFoundHandler(req, res, next) {
  res.status(404).json({ error: `Not found - ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error('API Error:', err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
