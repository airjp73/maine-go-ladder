import knex from "../../common/server/knex";
import createRequetHandler from "../../common/server/createRequestHandler";

export default createRequetHandler({
  GET: async (req, res) => {
    const result = await knex.select("*").from("users");
    return res.json(result);
  },
  POST: async (req, res) => {
    const result = await knex("users")
      .insert({ ...req.body, streak: 0 })
      .returning("*");
    return res.json(result);
  },
});
