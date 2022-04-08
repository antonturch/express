module.exports = class ApiError extends Error {
  public status: number;
  public errors: any = null;

  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static BadRequest(message: string, errors = []) {
    return new ApiError(400, message, errors);
  }
};
