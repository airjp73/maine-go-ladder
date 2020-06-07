import { NextApiRequest } from "next";
import jsonwebtoken from "jsonwebtoken";
import InternalServerError from "./InternalServerError";
import ForbiddenError from "./ForbiddenError";

const SECRET = process.env.JWT_SECRET;

function requireSession(req: NextApiRequest): void {
  if (!SECRET) throw new InternalServerError("Error with app configuration");
  if (!req.cookies.jwt) throw new ForbiddenError("Must be logged in");
  try {
    jsonwebtoken.verify(req.cookies.jwt, SECRET);
  } catch {
    throw new ForbiddenError("Unable to validate session");
  }
}

export default requireSession;
