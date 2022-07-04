import { StatusCodes } from "http-status-codes";
import { getReasonByStatusCode } from "./helpers";
import { ErrorCodes } from "./errorCodes";

export interface IError {
  code?: ErrorCodes;
  statusCode: StatusCodes;
  title: string;
  detail?: string;
  meta?: object;
}

export interface IGeneralErrorOptions {
  message?: string;
  title?: string;
  statusCode?: StatusCodes;
  code?: ErrorCodes;
  meta?: object;
}

export class GeneralError extends Error {
  private readonly title: string;
  private readonly statusCode: StatusCodes;
  private readonly code?: ErrorCodes;
  private readonly meta?: object;

  constructor(options: IGeneralErrorOptions = {}) {
    super(options.message || "");

    this.statusCode = options.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    this.title = options.title || getReasonByStatusCode(this.statusCode);
    this.code = options.code;
    this.meta = options.meta;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getError(): IError {
    return {
      code: this.code,
      statusCode: this.statusCode,
      title: this.title,
      detail: this.message || undefined,
      meta: this.meta,
    };
  }
}
