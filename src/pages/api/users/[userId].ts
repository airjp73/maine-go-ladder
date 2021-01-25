import * as yup from "yup";
import createRequestHandler from "../../../common/server/createRequestHandler";
import knex from "../../../common/server/knex";
import BadRequestError from "../../../common/server/BadRequestError";
import createAuditRecord from "../../../common/server/createAuditRecord";
import { AuditEventType } from "../../../resources/audit-events/AuditEvent";
import requireSession from "../../../common/server/requireSession";
import { User } from "../../../resources/users/User";

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

export async function editName(id: string, name: string): Promise<User> {
  return await knex.transaction(async (trx) => {
    const [oldName] = await trx("users").where("id", id).select("name");

    const updatedUsers = await trx("users")
      .where("id", id)
      .update({ name })
      .returning<User[]>("*");

    if (updatedUsers.length === 0)
      throw new Error("Failed to update any users");
    if (updatedUsers.length > 1) throw new Error("Updated too many users");

    await createAuditRecord(trx, AuditEventType.USER_RENAMED, {
      id,
      oldName,
      name,
    });
    return updatedUsers[0];
  });
}

const querySchema = yup
  .object({
    userId: yup.string().required(),
  })
  .required();

const patchBodySchema = yup
  .object({
    name: yup.string().required(),
  })
  .required();

export default createRequestHandler({
  DELETE: async (req, res) => {
    requireSession(req);
    const { userId } = await querySchema
      .validate(req.query)
      .catch(BadRequestError.throw);
    await archiveUser(userId);
    return res.status(200).send(200);
  },
  PATCH: async (req, res) => {
    requireSession(req);
    const { userId } = await querySchema
      .validate(req.query)
      .catch(BadRequestError.throw);
    const { name } = await patchBodySchema
      .validate(req.body)
      .catch(BadRequestError.throw);
    const user = await editName(userId, name);
    return res.status(200).json(user);
  },
});
