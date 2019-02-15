/**
 * Middleware to handle errors in the application.
 * @param err
 * @param req
 * @param res
 * @param next
 */
module.exports = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message
      }
    });
  };
  
  /**
   * Catch 404 errors and send them to the error handler.
   * @param req
   * @param res
   * @param next
   */
  module.exports.catch404 = (req, res, next) => {
    let error = new Error("Route Not Found");
    error.status = 404;
    next(error);
  };