import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import buttonStyle from "../styles/buttonStyle";
import { AnimatePresence, motion, MotionAdvancedProps } from "framer-motion";
import UserList from "../users/UserList";
import { User } from "../api/User";

interface AddGameFormProps {
  onAfterSubmit: () => void;
}

const field = (theme: Theme) => css`
  > * + * {
    margin-left: 0.5rem;
  }
`;

const error = css`
  font-size: 0.5rem;
  color: red;
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
  const { handleSubmit } = useForm<FormData>();
  const [blackPlayer, setBlackPlayer] = useState<User | null>(null);
  const [whitePlayer, setWhitePlayer] = useState<User | null>(null);
  const [winner, setWinner] = useState<User | null>(null);
  const [prevTab, setPrevTab] = useState<number>(-1);
  const [tab, setTab] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

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
    <form
      onSubmit={handleSubmit((values) => {
        // dispatch(
        //   () => {}
        // )
        //   .then(unwrapResult)
        //   .then(() => onAfterSubmit());
      })}
      css={css`
        > * {
          margin-top: 1rem;
        }
        display: flex;
        flex-direction: column;
        height: calc(100% - 4rem);
      `}
    >
      <div>
        <button
          css={buttonStyle}
          onClick={() => changeTab(0)}
          disabled={tab === 0}
        >
          Choose Black
        </button>
        <button
          css={buttonStyle}
          onClick={() => changeTab(1)}
          disabled={tab === 1}
        >
          Choose White
        </button>
        <button
          css={buttonStyle}
          onClick={() => changeTab(2)}
          disabled={tab === 2 || !blackPlayer || !whitePlayer}
        >
          Who Won?
        </button>
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
                  alert(`${user.name} won!`);
                }}
              />
            </TabContent>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default AddGameForm;
