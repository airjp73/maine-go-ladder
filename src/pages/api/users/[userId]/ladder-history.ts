import * as yup from "yup";
import createRequestHandler from "../../../../common/server/createRequestHandler";
import knex from "../../../../common/server/knex";
import BadRequestError from "../../../../common/server/BadRequestError";
import { LadderHistoryItem } from "../../../../resources/ladder-history/LadderHistoryItem";

export async function getLadderHistory(
  userId: string
): Promise<LadderHistoryItem[]> {
  return await knex("ladder_history").select("*").where({ user: userId });
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
    return res.status(200).json(await getLadderHistory(userId));
  },
});
