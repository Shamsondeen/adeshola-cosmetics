const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // Log the error for debugging
      console.error(`AsyncHandler Error: ${err.message}`);
      next(err);
    });
  };
  
 module.exports = asyncHandler;