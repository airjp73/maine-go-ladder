import knex from "../../common/server/knex";
import createRequestHandler from "../../common/server/createRequestHandler";

export default createRequestHandler({
  GET: async (req, res) => {
    const result = await knex
      .select("*")
      .from("users")
      .where({ archived: false });
    return res.json(result);
  },
  POST: async (req, res) => {
    const result = await knex("users")
      .insert({ ...req.body, streak: 0 })
      .returning("*");
    return res.json(result);
  },
});
