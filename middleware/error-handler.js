// const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    // if err.statusCode exists: use that, if not use StatusCodes.Internal_Server_Error
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };
  // custom error is replacing the lines below
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  if (err.name === 'ValidationError') {
    // here we take the array err.errors and make a string out of the each error message
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  }
  if (err.name === 'CastError') {
    // Cast error is if id of job is too long or too short
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 401;
  }
  // Line below will give back a long error Object instead of our custom msg
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
