import React from "react";
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

const AuditEvents: React.FC = () => {
  useDispatchEffect(() => fetchAuditEvents(), []);
  const auditEvents = useSelector(auditEventSelectors.selectAll);

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
        `}
      >
        {auditEvents.map((event) => (
          <p key={event.id}>
            {event.type}: {JSON.stringify(event.details)}
          </p>
        ))}
      </Content>
    </Wrapper>
  );
};

export default AuditEvents;
