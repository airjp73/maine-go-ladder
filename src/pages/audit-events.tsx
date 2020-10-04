import React, { useState } from "react";
import {
  Wrapper,
  Header,
  Content,
} from "../common/components/PageContent/PageContent";
import { css } from "@emotion/core";
import LinkButton from "../common/components/LinkButton/LinkButton";
import useDispatchEffect from "../common/util/useDispatchEffect";
import {
  fetchAuditEvents,
  AUDIT_EVENT_QUERY,
} from "../resources/audit-events/auditEventSlice";
import { useSelector } from "react-redux";
import {
  AuditEvent,
  AuditEventType,
  AuditDetails,
} from "../resources/audit-events/AuditEvent";
import listItemStyle from "../common/styles/listItemStyle";
import LabelledValue from "../common/components/LabelledValue/LabelledValue";
import { Theme } from "../common/styles/theme";
import { AnimatePresence } from "framer-motion";
import AnimateHeight from "../common/components/AnimateHeight/AnimateHeight";
import { AppState } from "../core/store";
import LoadingState from "../common/components/LoadingState/LoadingState";
import { userSelectors, fetchUsers } from "../resources/users/userSlice";
import { useInfiniteQuery } from "react-query";
import buttonStyle from "../common/styles/buttonStyle";

const getEventTypeLabel = (type: AuditEventType): string => {
  switch (type) {
    case AuditEventType.USER_CREATED:
      return "User Created";
    case AuditEventType.USER_DELETED:
      return "User Deleted";
    case AuditEventType.GAME_RECORDED:
      return "Game Recorded";
  }
};

const GameRecordedSummary: React.FC<{
  details: AuditDetails<AuditEventType.GAME_RECORDED>;
}> = ({ details }) => {
  const black = useSelector((state: AppState) =>
    userSelectors.selectById(state, details.black)
  );
  const white = useSelector((state: AppState) =>
    userSelectors.selectById(state, details.white)
  );
  if (black && white) return <>{`${black.name} vs ${white.name}`}</>;
  return null;
};

const getSummary = (event: AuditEvent): React.ReactNode => {
  switch (event.type) {
    case AuditEventType.USER_CREATED:
    case AuditEventType.USER_DELETED:
      return event.details.name;
    case AuditEventType.GAME_RECORDED:
      return <GameRecordedSummary details={event.details} />;
  }
};

const GameRecordedDetail: React.FC<{
  details: AuditDetails<AuditEventType.GAME_RECORDED>;
}> = ({ details }) => {
  const black = useSelector((state: AppState) =>
    userSelectors.selectById(state, details.black)
  );
  const white = useSelector((state: AppState) =>
    userSelectors.selectById(state, details.white)
  );
  const winner = useSelector((state: AppState) =>
    userSelectors.selectById(state, details.winner)
  );
  return (
    <div>
      <LabelledValue label="Id" value={details.gameId} />
      <LabelledValue
        label="Black"
        value={black?.name ?? details.black}
        href={`/user?userId=${details.black}`}
      />
      <LabelledValue
        label="White"
        value={white?.name ?? details.white}
        href={`/user?userId=${details.white}`}
      />
      <LabelledValue label="Winner" value={winner?.name ?? details.winner} />
    </div>
  );
};

const getDetails = (event: AuditEvent): Exclude<React.ReactNode, undefined> => {
  switch (event.type) {
    case AuditEventType.USER_CREATED:
    case AuditEventType.USER_DELETED:
      return (
        <div>
          <LabelledValue label="Id" value={event.details.id} />
          <LabelledValue
            label="Name"
            value={event.details.name}
            href={`/user?userId=${event.details.id}`}
          />
        </div>
      );
    case AuditEventType.GAME_RECORDED:
      return <GameRecordedDetail details={event.details} />;
  }
};

const AuditEventItem: React.FC<{
  auditEvent: AuditEvent;
  isSelected: boolean;
  onClick: () => void;
}> = ({ auditEvent, isSelected, onClick }) => (
  <div
    css={(theme: Theme) => css`
      ${listItemStyle(theme)}
      display: block;
    `}
    onClick={onClick}
  >
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <h2
        css={css`
          margin: 0 2rem 0 0;
        `}
      >
        {getEventTypeLabel(auditEvent.type)}
      </h2>
      <p
        css={css`
          margin-left: auto;
        `}
      >
        {getSummary(auditEvent)}
      </p>
    </div>
    <AnimatePresence>
      {isSelected && (
        <AnimateHeight key="details">{getDetails(auditEvent)}</AnimateHeight>
      )}
    </AnimatePresence>
  </div>
);

const AuditEvents: React.FC = () => {
  const {
    isLoading,
    data: auditEvents,
    fetchMore,
    isFetching,
    canFetchMore,
  } = useInfiniteQuery(AUDIT_EVENT_QUERY, fetchAuditEvents, {
    getFetchMore: (lastResponse) =>
      lastResponse.hasMore && lastResponse.page + 1,
  });

  useDispatchEffect(() => fetchUsers(), []);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  if (isLoading) return <LoadingState />;

  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header="Change History">
        <LinkButton href="/">Home</LinkButton>
      </Header>
      <Content
        css={css`
          padding: 1rem;
          > * + * {
            margin-top: 1rem;
          }
        `}
      >
        {auditEvents?.map((page) =>
          page.items.map((auditEvent) => (
            <AuditEventItem
              key={auditEvent.id}
              auditEvent={auditEvent}
              isSelected={selectedEvent === auditEvent.id}
              onClick={() => {
                if (selectedEvent === auditEvent.id) setSelectedEvent(null);
                else setSelectedEvent(auditEvent.id);
              }}
            />
          ))
        )}
        <div
          css={css`
            display: flex;
            height: 300px;
          `}
        >
          {canFetchMore ? (
            <button
              css={(theme) => [
                buttonStyle(theme),
                css`
                  height: min-content;
                  margin: 15px auto 0 auto;
                `,
              ]}
              disabled={isFetching}
              onClick={() => fetchMore()}
            >
              {isFetching ? "Loading..." : "Show more"}
            </button>
          ) : (
            <h3
              css={css`
                margin: 0 auto;
              `}
            >
              No More Records
            </h3>
          )}
        </div>
      </Content>
    </Wrapper>
  );
};

export default AuditEvents;
