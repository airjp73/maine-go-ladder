import Knex from "knex";
import {
  AuditEventType,
  AuditDetails,
} from "../../resources/audit-events/AuditEvent";

async function createAuditRecord<T extends AuditEventType>(
  trx: Knex.Transaction,
  type: T,
  details: AuditDetails<T>
): Promise<void> {
  await trx("audit_events").insert({
    type,
    details: JSON.stringify(details),
  });
}

export default createAuditRecord;
