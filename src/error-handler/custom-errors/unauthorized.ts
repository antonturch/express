import { StatusCodes } from "http-status-codes";
import { GeneralError, IGeneralErrorOptions } from "../error";

class UnauthorizedError extends GeneralError {
  constructor(options: IGeneralErrorOptions = {}) {
    super({ ...options, statusCode: StatusCodes.UNAUTHORIZED });
  }
}

export default UnauthorizedError;
