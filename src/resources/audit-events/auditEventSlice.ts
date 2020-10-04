import performFetch from "../../common/api/performFetch";
import { PaginatedResponse } from "../../types/apiTypes";
import { AuditEvent } from "./AuditEvent";

export const AUDIT_EVENT_QUERY = "audit-events";

export const fetchAuditEvents = async (
  key: string,
  page = 0
): Promise<PaginatedResponse<AuditEvent>> => {
  const response = await performFetch(`/api/audit-events?page=${page}`);
  return response.json();
};
