import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prisma P2025 = record not found — answer 404 so clients (and the public
  // site's SEO/notFound handling) can tell "missing" apart from a real crash.
  const isRecordNotFound = err?.code === 'P2025';
  res.status(isRecordNotFound ? httpStatus.NOT_FOUND : httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: isRecordNotFound ? 'Record not found' : err.message || 'Something went wrong!',
    error: err,
  });
};

export default globalErrorHandler;
