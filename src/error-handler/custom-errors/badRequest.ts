import { StatusCodes } from "http-status-codes";
import { GeneralError, IGeneralErrorOptions } from "../error";

class BadRequestError extends GeneralError {
  constructor(options: IGeneralErrorOptions = {}) {
    super({
      ...options,
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }
}

export default BadRequestError;
