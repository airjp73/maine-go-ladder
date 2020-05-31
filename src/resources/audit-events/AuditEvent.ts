import { User } from "../users/User";

export enum AuditEventType {
  USER_CREATED = "USER_CREATED",
  GAME_RECORDED = "GAME_RECORDED",
}

export interface BaseAuditEvent {
  id: string;
  reverted: boolean;
  created_at: string;
}

export interface CreateUserAuditEvent extends BaseAuditEvent {
  type: AuditEventType.USER_CREATED;
  details: Pick<User, "id" | "name">;
}

export interface GameRecordedAuditEvent extends BaseAuditEvent {
  type: AuditEventType.GAME_RECORDED;
  details: { black: string }; // TODO: add more
}

export type AuditEvent = CreateUserAuditEvent | GameRecordedAuditEvent;

export type AuditDetails<
  T extends AuditEventType,
  A extends AuditEvent = AuditEvent
> = A extends {
  type: T;
}
  ? A["details"]
  : never;

export type NewAuditEvent = Pick<AuditEvent, "type" | "details">;
