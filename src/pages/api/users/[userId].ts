import * as yup from "yup";
import createRequestHandler from "../../../common/server/createRequestHandler";
import knex from "../../../common/server/knex";
import BadRequestError from "../../../common/server/BadRequestError";
import createAuditRecord from "../../../common/server/createAuditRecord";
import { AuditEventType } from "../../../resources/audit-events/AuditEvent";

export async function archiveUser(userId: string): Promise<void> {
  await knex.transaction(async (trx) => {
    const name = await trx("users")
      .where("id", userId)
      .update({ archived: true })
      .returning("name");
    await createAuditRecord(trx, AuditEventType.USER_DELETED, {
      id: userId,
      name: name[0],
    });
  });
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
