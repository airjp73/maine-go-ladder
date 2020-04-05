import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import buttonStyle from "../styles/buttonStyle";
import { AnimatePresence, motion, MotionAdvancedProps } from "framer-motion";
import UserList, { UserItem } from "../users/UserList";
import { User } from "../api/User";
import { ArrowRight, UserCheck, Check } from "react-feather";
import Fab from "../components/SpeedDial/Fab";
import GoIcon from "../components/SpeedDial/GoIcon";

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
          > * + * {
            margin-left: 1rem;
          }
        `}
      >
        <Fab onClick={() => changeTab(0)} highlighted={tab === 0}>
          <GoIcon />
        </Fab>

        <ArrowRight />

        <Fab onClick={() => changeTab(1)} highlighted={tab === 1}>
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
          onClick={() => changeTab(2)}
          disabled={!blackPlayer || !whitePlayer || !winner}
          highlighted={tab === 3}
        >
          <Check />
        </Fab>
      </div>

      <div
        css={css`
          position: relative;
          flex: 1;
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
            <TabContent variants={variants} key="who-won">
              <h1>Is this Correct?</h1>

              <h4>Black</h4>
              <UserItem user={blackPlayer} />

              <h4>White</h4>
              <UserItem user={whitePlayer} />

              <h4>Winner</h4>
              <UserItem user={winner} />

              <button
                onClick={() => {
                  alert(
                    `${winner.name} won! This part is not implemented yet.`
                  );
                }}
                css={buttonStyle}
                style={{ marginTop: "1rem" }}
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
