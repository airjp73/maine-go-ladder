import React, { useState } from "react";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import buttonStyle from "../styles/buttonStyle";
import { AnimatePresence, motion } from "framer-motion";
import UserList, { UserItem } from "../users/UserList";
import { User } from "../api/User";
import { ArrowRight, UserCheck, Check } from "react-feather";
import Fab from "../components/SpeedDial/Fab";
import GoIcon from "../components/SpeedDial/GoIcon";
import useUserFetch from "../users/useUserFetch";

interface AddGameFormProps {
  onAfterSubmit: () => void;
}

const field = (theme: Theme) => css`
  > * + * {
    margin-left: 0.5rem;
  }
`;

type TabCustomProp = { prev: number; current: number };

const transition = { type: "spring", stiffness: 375, damping: 30 };
const TabContent: React.FC<React.ComponentProps<typeof motion.div>> = (
  props
) => (
  <motion.div
    css={css`
      overflow: auto;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    `}
    animate="enter"
    initial="initial"
    exit="exit"
    transition={transition}
    {...props}
  />
);

const AddGameForm: React.FC<AddGameFormProps> = ({ onAfterSubmit }) => {
  useUserFetch();
  const [blackPlayer, setBlackPlayer] = useState<User | null>(null);
  const [whitePlayer, setWhitePlayer] = useState<User | null>(null);
  const [winner, setWinner] = useState<User | null>(null);
  const [prevTab, setPrevTab] = useState<number>(-1);
  const [tab, setTab] = useState<number>(0);

  const variants = {
    initial: {
      x: prevTab < tab ? "125%" : "-125%",
    },
    enter: { x: 0 },
    exit: ({ prev, current }: TabCustomProp) => ({
      x: prev < current ? "-125%" : "125%",
    }),
  };

  const changeTab = (nextTab: number) => {
    setPrevTab(tab);
    setTab(nextTab);
  };

  return (
    <div
      css={css`
        > * {
          margin-top: 1rem;
        }
        display: flex;
        flex-direction: column;
        height: calc(100% - 4rem);
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          > * + * {
            margin-left: 1rem;
          }
        `}
      >
        <Fab onClick={() => changeTab(0)} highlighted={tab === 0}>
          <GoIcon />
        </Fab>

        <ArrowRight />

        <Fab
          onClick={() => changeTab(1)}
          highlighted={tab === 1}
          disabled={!blackPlayer}
        >
          <GoIcon />
        </Fab>

        <ArrowRight />

        <Fab
          onClick={() => changeTab(2)}
          disabled={!blackPlayer || !whitePlayer}
          highlighted={tab === 2}
        >
          <UserCheck />
        </Fab>

        <ArrowRight />

        <Fab
          onClick={() => changeTab(3)}
          disabled={!blackPlayer || !whitePlayer || !winner}
          highlighted={tab === 3}
        >
          <Check />
        </Fab>
      </div>

      <div
        css={(theme: Theme) => css`
          position: relative;
          flex: 1;
          h1 {
            position: sticky;
            top: 0;
            margin: 0;
            padding-bottom: 1rem;
            background-color: ${theme.colors.background};
            z-index: 1;
          }
        `}
      >
        <AnimatePresence custom={{ prev: prevTab, current: tab }}>
          {tab === 0 && (
            <TabContent variants={variants} key="choose-black">
              <h1>Who played black?</h1>
              <UserList
                onUserClick={(user) => {
                  setTab(1);
                  setBlackPlayer(user);
                }}
              />
            </TabContent>
          )}
          {tab === 1 && (
            <TabContent variants={variants} key="choose-white">
              <h1>Who played white?</h1>
              <UserList
                onUserClick={(user) => {
                  setTab(2);
                  setWhitePlayer(user);
                }}
              />
            </TabContent>
          )}
          {tab === 2 && !!blackPlayer && !!whitePlayer && (
            <TabContent variants={variants} key="who-won">
              <h1>Who won?</h1>
              <UserList
                userList={[blackPlayer, whitePlayer]}
                onUserClick={(user) => {
                  setTab(3);
                  setWinner(user);
                }}
              />
            </TabContent>
          )}
          {tab === 3 && !!blackPlayer && !!whitePlayer && !!winner && (
            <TabContent
              variants={variants}
              key="who-won"
              css={css`
                display: flex;
                flex-direction: column;

                h3 {
                  margin-bottom: 0;
                }
              `}
            >
              <h1>Is this Correct?</h1>

              <h3>Black</h3>
              <UserItem user={blackPlayer} />

              <h3>White</h3>
              <UserItem user={whitePlayer} />

              <h3>Winner</h3>
              <UserItem user={winner} />

              <button
                onClick={() => {
                  alert(
                    `${winner.name} won! This part is not implemented yet.`
                  );
                }}
                css={(theme: Theme) => css`
                  ${buttonStyle(theme)}
                  margin: auto 0 2rem 0;
                `}
              >
                Yep!
              </button>
            </TabContent>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AddGameForm;
