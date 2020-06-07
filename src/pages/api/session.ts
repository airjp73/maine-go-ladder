import jsonwebtoken from "jsonwebtoken";
import createRequestHandler from "../../common/server/createRequestHandler";

/**
 * A bit of an unorthodox approach to authentication.
 */
const SECRET = process.env.JWT_SECRET;

export default createRequestHandler({
  GET: async (req, res) => {
    if (!SECRET) return res.status(500).send("Error with app configuration");

    try {
      const jwt = jsonwebtoken.verify(req.cookies.jwt, SECRET);
      return res.status(200).json(jwt);
    } catch {
      return res.status(200).json(null);
    }
  },
});
