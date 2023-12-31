import HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import UnauthenticatedError from '../error/UnauthenticatedError';

import loggerWithNameSpace from '../utils/logger';
import BadRequestError from '../error/BadRequestError';
import NotFoundError from '../error/NotFoundError';

const logger = loggerWithNameSpace('ErrorHandler');

export function genericErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err.stack) {
    logger.error(err.stack);
  }

  if (err instanceof UnauthenticatedError) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: err.message });
  }

  if (err instanceof BadRequestError) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
    });
  }

  return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
}
