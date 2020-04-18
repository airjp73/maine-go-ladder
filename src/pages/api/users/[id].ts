import knex from "../../../common/server/knex";
import createRequetHandler from "../../../common/server/createRequestHandler";

export default createRequetHandler({
  GET: async (req, res) => {
    if (!req.query.id) res.status(400).json({ message: "Missing id" });

    const result = await knex
      .select("users.*")
      .select(
        knex.raw(`array_agg(json_build_object(
        'id', games.id,
        'white', games.white_player,
        'black', games.black_player,
        'winner', games.winning_player,
        'created_at', games.created_at
      )) as games`)
      )
      .from("users")
      .leftJoin("games", function () {
        this.on("games.black_player", "=", "users.id").orOn(
          "games.white_player",
          "=",
          "users.id"
        );
      })
      .where("users.id", req.query.id)
      .groupBy("users.id");
    return res.json(result[0]);
  },
});
