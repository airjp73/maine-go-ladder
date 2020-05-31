import createRequestHandler from "../../common/server/createRequestHandler";
import knex from "../../common/server/knex";
import { AuditEvent } from "../../resources/audit-events/AuditEvent";

export function getAuditEvents(): Promise<AuditEvent[]> {
  return knex("audit_events").select("*");
}

export default createRequestHandler({
  GET: async (req, res) => {
    return res.json(await getAuditEvents());
  },
});
