import Knex from "knex";

export enum AuditEventType {
  USER_CREATED = "USER_CREATED",
}

async function createAuditRecord(
  trx: Knex.Transaction,
  type: AuditEventType,
  details: Record<string, unknown>
): Promise<void> {
  await trx("audit_events").insert({
    type,
    details: JSON.stringify(details),
  });
}

export default createAuditRecord;
