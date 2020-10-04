import * as yup from "yup";
import BadRequestError from "../../common/server/BadRequestError";
import createRequestHandler from "../../common/server/createRequestHandler";
import knex from "../../common/server/knex";
import { AuditEvent } from "../../resources/audit-events/AuditEvent";
import { PaginatedResponse } from "../../types/apiTypes";

export const AUDIT_PAGE_SIZE = 20;

export async function getAuditEvents(
  page: number
): Promise<PaginatedResponse<AuditEvent>> {
  const items = await knex("audit_events")
    .select("*")
    .orderBy("created_at", "desc")
    .offset(page * AUDIT_PAGE_SIZE)
    .limit(AUDIT_PAGE_SIZE);
  return {
    items,
    page,
    hasMore: items.length === AUDIT_PAGE_SIZE,
  };
}

const querySchema = yup
  .object({
    page: yup.number().required(),
  })
  .required();

export default createRequestHandler({
  GET: async (req, res) => {
    const { page } = await querySchema
      .validate(req.query)
      .catch(BadRequestError.throw);
    return res.json(await getAuditEvents(page));
  },
});
