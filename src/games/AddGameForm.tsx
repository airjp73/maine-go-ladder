import React, { useState } from "react";
import { css } from "@emotion/core";
import { Theme } from "../common/styles/theme";
import buttonStyle from "../common/styles/buttonStyle";
import { AnimatePresence, motion } from "framer-motion";
import UserList from "../users/UserList";
import { User } from "../apiTypes/User";
import { Content } from "../common/components/PageContent/PageContent";
import { ArrowRight, UserCheck, Check } from "react-feather";
import Fab from "../common/components/SpeedDial/Fab";
import GoIcon from "../common/components/SpeedDial/GoIcon";
import UserItem from "../users/UserItem";
import { useDispatch } from "react-redux";
import { postGame } from "../users/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "../core/store";

interface AddGameFormProps {
  onAfterSubmit: (black: string, white: string) => void;
}

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

const getErrors = (
  blackPlayer: User | null,
  whitePlayer: User | null,
  winner: User | null
) => {
  if (!blackPlayer) return "Must choose a player for black";
  if (!whitePlayer) return "Must choose a player for white";
  if (!winner) return "Must choose a winner";
  if (blackPlayer === whitePlayer)
    return "Cannot choose the same player for both black and white";
  if (![blackPlayer, whitePlayer].includes(winner))
    return "The winner must be one of the selected players";
};

const AddGameForm: React.FC<AddGameFormProps> = ({ onAfterSubmit }) => {
  const [blackPlayer, setBlackPlayer] = useState<User | null>(null);
  const [whitePlayer, setWhitePlayer] = useState<User | null>(null);
  const [winner, setWinner] = useState<User | null>(null);
  const [prevTab, setPrevTab] = useState<number>(-1);
  const [tab, setTab] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const error = getErrors(blackPlayer, whitePlayer, winner);

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

  const submit = () => {
    const black = blackPlayer!.id;
    const white = whitePlayer!.id;
    const loser = black === winner!.id ? white : black;
    dispatch(
      postGame({
        black,
        white,
        winner: winner!.id,
      })
    )
      .then(unwrapResult)
      .then(() => onAfterSubmit(black, white));
  };

  return (
    <div
      css={(theme: Theme) => css`
        > * {
          margin-top: 1rem;
        }
        display: flex;
        flex-direction: column;
        height: calc(100% - ${theme.headerHeight});
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1rem auto;
          > * + * {
            margin-left: 1rem;
          }
        `}
      >
        <Fab onClick={() => changeTab(0)} highlighted={tab === 0} size="SMALL">
          <GoIcon />
        </Fab>

        <ArrowRight />

        <Fab
          onClick={() => changeTab(1)}
          highlighted={tab === 1}
          disabled={!blackPlayer}
          size="SMALL"
        >
          <GoIcon />
        </Fab>

        <ArrowRight />

        <Fab
          onClick={() => changeTab(2)}
          disabled={!blackPlayer || !whitePlayer}
          highlighted={tab === 2}
          size="SMALL"
        >
          <UserCheck />
        </Fab>

        <ArrowRight />

        <Fab
          onClick={() => changeTab(3)}
          disabled={!blackPlayer || !whitePlayer || !winner}
          highlighted={tab === 3}
          size="SMALL"
        >
          <Check />
        </Fab>
      </div>

      <Content
        css={(theme: Theme) => css`
          flex: 1;
          margin: 1rem auto;
          max-width: 750px;
          width: 100%;
          box-sizing: border-box;
          h1 {
            padding: 0 1rem;
            position: sticky;
            top: 0;
            margin: 0;
            padding-bottom: 1rem;
            background-color: ${theme.colors.background};
            z-index: 1;
          }
        `}
      >
        <div
          css={css`
            height: 100%;
            overflow: hidden;
            position: relative;
          `}
        >
          <AnimatePresence custom={{ prev: prevTab, current: tab }}>
            {tab === 0 && (
              <TabContent variants={variants} key="choose-black">
                <h1>Who played black?</h1>
                <UserList
                  onUserClick={(user) => {
                    changeTab(1);
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
                    changeTab(2);
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
                    changeTab(3);
                    setWinner(user);
                  }}
                />
              </TabContent>
            )}
            {tab === 3 && !!blackPlayer && !!whitePlayer && !!winner && (
              <TabContent
                variants={variants}
                key="confirm"
                css={css`
                  display: flex;
                  flex-direction: column;
                  padding: 0 1rem;

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
                  onClick={() => submit()}
                  css={(theme: Theme) => css`
                    ${buttonStyle(theme)}
                    margin: auto 0 2rem 0;
                  `}
                  disabled={!!error}
                >
                  {error || "Yep!"}
                </button>
              </TabContent>
            )}
          </AnimatePresence>
        </div>
      </Content>
    </div>
  );
};

export default AddGameForm;
