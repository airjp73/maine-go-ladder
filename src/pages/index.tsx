import { css } from "@emotion/core";
import React, { useState } from "react";
import { User, List, Menu } from "react-feather";
import {
  Wrapper,
  Header,
  Content,
} from "../common/components/PageContent/PageContent";
import NavLink from "../common/components/Nav/NavLink";
import { fetchUsers } from "../resources/users/userSlice";
import GoIcon from "../common/components/SpeedDial/GoIcon";
import MainPageUserList from "../users/MainPageUserList";
import MatchupCalculator from "../users/MatchupCalculator";
import useDispatchEffect from "../common/util/useDispatchEffect";
import SlideOutPanel from "../common/components/Nav/SlideOutPanel";
import Fab from "../common/components/SpeedDial/Fab";
import Link from "next/link";
import { fetchSession } from "../resources/session/sessionSlice";
import { useSelector } from "react-redux";
import { AppState } from "../core/store";
import LinkButton from "../common/components/LinkButton/LinkButton";
import useSessionState, {
  SessionStates,
} from "../resources/session/useSessionState";

const Home: React.FC = () => {
  useDispatchEffect(() => fetchUsers(), []);
  useDispatchEffect(() => fetchSession(), []);
  const [active, setActive] = useState(false);
  const sessionState = useSessionState();

  return (
    <Wrapper
      initial={{ scale: 0.9, opacity: 0, zIndex: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <Header
        menuButton={
          <button
            css={css`
              border: none;
              background: none;
              padding: 0;
              cursor: pointer;
              margin-right: 1rem;
            `}
            onClick={() => setActive(true)}
          >
            <Menu height="2rem" width="2rem" />
          </button>
        }
        header="Maine Go Ladder"
      >
        {sessionState === SessionStates.LOGGED_OUT && (
          <LinkButton href="/login">Log In</LinkButton>
        )}
        <SlideOutPanel active={active} onClose={() => setActive(false)}>
          <nav>
            <NavLink
              icon={
                <User
                  width="1.75rem"
                  height="1.75rem"
                  style={{ marginRight: "0.5rem" }}
                />
              }
              href="/add-user"
            >
              New User
            </NavLink>
            <NavLink
              icon={
                <GoIcon
                  width="1.75rem"
                  height="1.75rem"
                  style={{ marginRight: "0.5rem" }}
                />
              }
              href="/record-game"
            >
              Record Game
            </NavLink>
            <NavLink
              icon={
                <List
                  width="1.75rem"
                  height="1.75rem"
                  style={{ marginRight: "0.5rem" }}
                />
              }
              href="/audit-events"
            >
              Changelog
            </NavLink>
          </nav>
        </SlideOutPanel>
      </Header>
      <MatchupCalculator />
      <Content
        css={css`
          display: flex;
          flex-direction: column;
          text-align: center;
        `}
      >
        <MainPageUserList />
        {sessionState === SessionStates.LOGGED_IN && (
          <Link href="/record-game">
            <a>
              <Fab
                css={css`
                  position: absolute;
                  top: calc(100% - 6rem);
                  right: 2rem;
                  transition: top 0.25s ease 1s, bottom 0.25s ease 1s;
                  z-index: 1;

                  @media only screen and (min-width: 1000px) {
                    bottom: unset;
                    top: 2rem;
                  }
                `}
              >
                <GoIcon />
              </Fab>
            </a>
          </Link>
        )}
      </Content>
    </Wrapper>
  );
};

export default Home;
