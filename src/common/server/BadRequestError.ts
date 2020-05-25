import { ValidationError } from "yup";

const buildMessageString = (reason: string | ValidationError): string => {
  if (typeof reason === "string") return reason;

  return reason.message;
};

class BadRequestError extends Error {
  static throw = (reason: string | ValidationError) => {
    throw new BadRequestError(reason);
  };

  status = 400;

  constructor(reason: string | ValidationError) {
    super(buildMessageString(reason));
  }
}

export default BadRequestError;
