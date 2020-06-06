import {
  AuditEventType,
  AuditDetails,
} from "../../resources/audit-events/AuditEvent";
import knex from "./knex";

async function expectAuditRecord<T extends AuditEventType>(
  type: T,
  details: AuditDetails<T>
): Promise<void> {
  const auditRecords = await knex("audit_events").select("*");
  expect(auditRecords).toHaveLength(1);
  expect(auditRecords[0].type).toEqual(type);
  expect(auditRecords[0].details).toStrictEqual(details);
}

export default expectAuditRecord;
