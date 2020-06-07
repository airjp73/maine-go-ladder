import { ValidationError } from "yup";

const buildMessageString = (reason: string | ValidationError): string => {
  if (typeof reason === "string") return reason;

  return reason.message;
};

class ForbiddenError extends Error {
  static throw = (reason: string | ValidationError) => {
    throw new ForbiddenError(reason);
  };

  status = 403;

  constructor(reason: string | ValidationError) {
    super(buildMessageString(reason));
  }
}

export default ForbiddenError;
