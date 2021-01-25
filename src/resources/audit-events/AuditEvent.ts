import { User } from "../users/User";

export enum AuditEventType {
  USER_CREATED = "USER_CREATED",
  USER_DELETED = "USER_DELETED",
  USER_RENAMED = "USER_RENAMED",
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

export interface DeleteUserAuditEvent extends BaseAuditEvent {
  type: AuditEventType.USER_DELETED;
  details: Pick<User, "id" | "name">;
}

export interface UserRenamedAuditEvent extends BaseAuditEvent {
  type: AuditEventType.USER_RENAMED;
  details: { id: string; name: string; oldName: string };
}

export interface GameRecordedAuditEvent extends BaseAuditEvent {
  type: AuditEventType.GAME_RECORDED;
  details: {
    gameId: string;
    black: string;
    white: string;
    winner: string;
  };
}

export type AuditEvent =
  | CreateUserAuditEvent
  | DeleteUserAuditEvent
  | GameRecordedAuditEvent
  | UserRenamedAuditEvent;

export type AuditDetails<
  T extends AuditEventType,
  A extends AuditEvent = AuditEvent
> = A extends {
  type: T;
}
  ? A["details"]
  : never;

export type NewAuditEvent = Pick<AuditEvent, "type" | "details">;
