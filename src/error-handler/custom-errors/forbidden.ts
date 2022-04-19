import { StatusCodes } from "http-status-codes";
import { GeneralError, IGeneralErrorOptions } from "../error";

class ForbiddenError extends GeneralError {
  constructor(options: IGeneralErrorOptions = {}) {
    super({
      ...options,
      statusCode: StatusCodes.FORBIDDEN,
    });
  }
}

export default ForbiddenError;
