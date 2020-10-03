import * as yup from "yup";
import createRequestHandler from "../../common/server/createRequestHandler";
import knex from "../../common/server/knex";
import { Game } from "../../resources/games/Game";
import BadRequestError from "../../common/server/BadRequestError";
import { PaginatedResponse } from "../../types/apiTypes";

export const GAMES_PAGE_SIZE = 10;

export async function getGamesForUser(
  userId: string,
  page: number
): Promise<PaginatedResponse<Game>> {
  const games = await knex
    .select("games.*")
    .select("b.name as blackName")
    .select("w.name as whiteName")
    .from("games")
    .leftJoin("users as b", "games.black", "b.id")
    .leftJoin("users as w", "games.white", "w.id")
    .where("black", userId)
    .or.where("white", userId)
    .orderBy("created_at", "desc")
    .offset(page * GAMES_PAGE_SIZE)
    .limit(GAMES_PAGE_SIZE);

  return {
    items: games.map((game) => {
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
    }),
    page,
    hasMore: games.length == GAMES_PAGE_SIZE,
  };
}

const querySchema = yup
  .object({
    userId: yup.string().required(),
    page: yup.number().required(),
  })
  .required();

export default createRequestHandler({
  GET: async (req, res) => {
    const { userId, page } = await querySchema
      .validate(req.query)
      .catch(BadRequestError.throw);
    return res.json(await getGamesForUser(userId, page));
  },
});
