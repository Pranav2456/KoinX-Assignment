import { Status } from "../types/api.types";

/**
 * @params {`statusCode`, `status`, `message`}
 */
class AppError extends Error {
  statusCode: number;
  status: string;
  constructor(statusCode: number, status: Status, message: string) {
    super(message || "Something went wrong");
    this.statusCode = statusCode || 500;
    this.status = status || "error";
  }
}

export default AppError;
