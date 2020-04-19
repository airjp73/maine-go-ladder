import createRequestHandler from "../../common/server/createRequestHandler";
import knex from "../../common/server/knex";

export default createRequestHandler({
  GET: async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("Missing userId param");
    const games = await knex
      .select("games.*")
      .select("b.name as blackName")
      .select("w.name as whiteName")
      .from("games")
      .leftJoin("users as b", "games.black", "b.id")
      .leftJoin("users as w", "games.white", "w.id")
      .where("black", userId)
      .or.where("white", userId);
    const gamesWithPlayers = games.map((game) => ({
      ...game,
      black: {
        id: game.black,
        name: game.blackName,
      },
      white: {
        id: game.white,
        name: game.whiteName,
      },
    }));
    return res.json(gamesWithPlayers);
  },
});
