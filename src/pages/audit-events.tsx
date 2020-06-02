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
  auditEventSelectors,
} from "../resources/audit-events/auditEventSlice";
import { useSelector } from "react-redux";
import {
  AuditEvent,
  AuditEventType,
} from "../resources/audit-events/AuditEvent";
import listItemStyle from "../common/styles/listItemStyle";
import LabelledValue from "../common/components/LabelledValue/LabelledValue";
import { Theme } from "../common/styles/theme";
import { AnimatePresence } from "framer-motion";
import AnimateHeight from "../common/components/AnimateHeight/AnimateHeight";
import { AppState } from "../core/store";
import LoadingStates from "../common/enum/LoadingStates";
import LoadingState from "../common/components/LoadingState/LoadingState";

const getEventTypeLabel = (type: AuditEventType): string => {
  switch (type) {
    case AuditEventType.USER_CREATED:
      return "User Created";
    case AuditEventType.GAME_RECORDED:
      return "Game Recorded";
  }
};

const getSummary = (event: AuditEvent): string => {
  switch (event.type) {
    case AuditEventType.USER_CREATED:
      return event.details.name;
    case AuditEventType.GAME_RECORDED:
      return "";
  }
};

const getDetails = (event: AuditEvent): Exclude<React.ReactNode, undefined> => {
  switch (event.type) {
    case AuditEventType.USER_CREATED:
      return (
        <div>
          <LabelledValue label="Id" value={event.details.id} />
          <LabelledValue label="Name" value={event.details.name} />
        </div>
      );
    case AuditEventType.GAME_RECORDED:
      return <div />;
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
  useDispatchEffect(() => fetchAuditEvents(), []);
  const auditEvents = useSelector(auditEventSelectors.selectAll);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const isLoading = useSelector(
    (state: AppState) => state.auditEvents.loading !== LoadingStates.COMPLETE
  );

  if (isLoading) return <LoadingState />;

  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header="Change History">
        <LinkButton href="/">Back</LinkButton>
      </Header>
      <Content
        css={css`
          padding: 1rem;
          > * + * {
            margin-top: 1rem;
          }
        `}
      >
        {auditEvents.map((auditEvent) => (
          <AuditEventItem
            key={auditEvent.id}
            auditEvent={auditEvent}
            isSelected={selectedEvent === auditEvent.id}
            onClick={() => {
              if (selectedEvent === auditEvent.id) setSelectedEvent(null);
              else setSelectedEvent(auditEvent.id);
            }}
          />
        ))}
      </Content>
    </Wrapper>
  );
};

export default AuditEvents;
