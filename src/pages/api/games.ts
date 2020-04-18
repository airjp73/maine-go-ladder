import createRequestHandler from "../../common/server/createRequestHandler";
import knex from "../../common/server/knex";

export default createRequestHandler({
  GET: async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("Missing userId param");
    const data = await knex
      .select("*")
      .from("games")
      .where("black_player", userId)
      .or.where("white_player", userId);

    // TODO: Change this in the database
    return res.json(
      data.map((game) => ({
        ...game,
        black: game.black_player,
        white: game.white_player,
        winner: game.winning_player,
      }))
    );
  },
});
