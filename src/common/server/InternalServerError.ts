import { ValidationError } from "yup";

const buildMessageString = (reason: string | ValidationError): string => {
  if (typeof reason === "string") return reason;

  return reason.message;
};

class InternalServerError extends Error {
  static throw = (reason: string | ValidationError) => {
    throw new InternalServerError(reason);
  };

  status = 500;

  constructor(reason: string | ValidationError) {
    super(buildMessageString(reason));
  }
}

export default InternalServerError;
