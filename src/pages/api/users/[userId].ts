import createRequestHandler from "../../../common/server/createRequestHandler";
import knex from "../../../common/server/knex";

export default createRequestHandler({
  DELETE: async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).send("Missing `userId` parameter");
    await knex("users").where("id", userId).update({ archived: true });
    return res.status(200).send(200);
  },
});
