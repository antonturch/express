import { NextFunction, Request, Response } from "express";
import { GeneralError, IError } from "../error-handler/error";

interface IErrorResponseBody {
  error: IError;
}

function getGeneralError(err: Error): GeneralError {
  return err instanceof GeneralError ? err : new GeneralError();
}

export default function handleErrors(
  err: Error,
  req: Request,
  res: Response<IErrorResponseBody>,
  next: NextFunction
): void {
  const generalError = getGeneralError(err);

  console.error(err);
  res.status(generalError.getStatusCode()).json({
    error: generalError.getError(),
  });
}
