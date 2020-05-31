import * as yup from "yup";
import createRequestHandler from "../../common/server/createRequestHandler";
import knex from "../../common/server/knex";
import { Game } from "../../resources/games/Game";
import BadRequestError from "../../common/server/BadRequestError";

export async function getGamesForUser(userId: string): Promise<Game[]> {
  const games = await knex
    .select("games.*")
    .select("b.name as blackName")
    .select("w.name as whiteName")
    .from("games")
    .leftJoin("users as b", "games.black", "b.id")
    .leftJoin("users as w", "games.white", "w.id")
    .where("black", userId)
    .or.where("white", userId);

  return games.map((game) => {
    const { black, blackName, white, whiteName, ...gameData } = game;
    return {
      ...gameData,
      black: {
        id: black,
        name: blackName,
      },
      white: {
        id: white,
        name: whiteName,
      },
    };
  });
}

const querySchema = yup
  .object({
    userId: yup.string().required(),
  })
  .required();

export default createRequestHandler({
  GET: async (req, res) => {
    const { userId } = await querySchema
      .validate(req.query)
      .catch(BadRequestError.throw);
    return res.json(await getGamesForUser(userId));
  },
});
