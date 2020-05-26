import * as yup from "yup";
import createRequestHandler from "../../../common/server/createRequestHandler";
import knex from "../../../common/server/knex";
import BadRequestError from "../../../common/server/BadRequestError";

export async function archiveUser(userId: string) {
  await knex("users").where("id", userId).update({ archived: true });
}

const querySchema = yup
  .object({
    userId: yup.string().required(),
  })
  .required();

export default createRequestHandler({
  DELETE: async (req, res) => {
    const { userId } = await querySchema
      .validate(req.query)
      .catch(BadRequestError.throw);
    await archiveUser(userId);
    return res.status(200).send(200);
  },
});
