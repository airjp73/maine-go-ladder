import createRequestHandler from "../../common/server/createRequestHandler";
import knex from "../../common/server/knex";

export default createRequestHandler({
  GET: async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("Missing userId param");
    const data = await knex
      .select("*")
      .from("games")
      .where("black", userId)
      .or.where("white", userId);
    return res.json(data);
  },
});
