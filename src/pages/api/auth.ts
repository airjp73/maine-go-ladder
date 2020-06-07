import * as yup from "yup";
import cookie from "cookie";
import jsonwebtoken from "jsonwebtoken";
import createRequestHandler from "../../common/server/createRequestHandler";
import BadRequestError from "../../common/server/BadRequestError";

/**
 * A bit of an unorthodox approach to authentication.
 */
const PASSWORD = process.env.LOGIN_PASSWORD;
const SECRET = process.env.JWT_SECRET;

const bodySchema = yup
  .object({
    password: yup.string().required(),
  })
  .required();

export default createRequestHandler({
  POST: async (req, res) => {
    const { password } = await bodySchema
      .validate(req.body)
      .catch(BadRequestError.throw);

    if (!SECRET || !PASSWORD)
      return res.status(500).send("Error with app configuration");

    if (password === PASSWORD) {
      const jwt = jsonwebtoken.sign({ loginDate: Date.now() }, SECRET);
      res.setHeader("Set-Cookie", cookie.serialize("jwt", jwt));
      return res.status(200).send("Logged In!");
    } else {
      return res.status(401).send("Incorrect Password");
    }
  },
});
