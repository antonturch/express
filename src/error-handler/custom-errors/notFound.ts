import { StatusCodes } from "http-status-codes";
import { GeneralError, IGeneralErrorOptions } from "../error";

class NotFoundError extends GeneralError {
  constructor(options: IGeneralErrorOptions = {}) {
    super({ ...options, statusCode: StatusCodes.NOT_FOUND });
  }
}

export default NotFoundError;
