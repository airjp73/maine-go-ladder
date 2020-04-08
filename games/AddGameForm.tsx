import React, { useState } from "react";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import buttonStyle from "../styles/buttonStyle";
import { AnimatePresence, motion } from "framer-motion";
import UserList, { USERS } from "../users/UserList";
import { User } from "../api/User";
import { ArrowRight, UserCheck, Check } from "react-feather";
import Fab from "../components/SpeedDial/Fab";
import GoIcon from "../components/SpeedDial/GoIcon";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import UserItem from "../users/UserItem";

const ADD_GAME = gql`
  mutation AddGame($black: uuid!, $white: uuid!, $winner: uuid) {
    insert_games(
      objects: { black_player: $black, white_player: $white, winner: $winner }
    ) {
      returning {
        id
      }
    }
  }
`;

const UPDATE_WINNER = gql`
  mutation UpdateWinner($winner: uuid!) {
    update_users(where: { id: { _eq: $winner } }, _inc: { ladder_rung: 1 }) {
      returning {
        id
        ladder_rung
        name
      }
    }
  }
`;

const UPDATE_LOSER = gql`
  mutation UpdateLoser($loser: uuid!) {
    update_users(where: { id: { _eq: $loser } }, _inc: { ladder_rung: -1 }) {
      returning {
        id
        ladder_rung
        name
      }
    }
  }
`;

interface AddGameFormProps {
  onAfterSubmit: (black: string, white: string) => void;
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
  const error = getErrors(blackPlayer, whitePlayer, winner);
  const [addGame] = useMutation(ADD_GAME);
  const [updateWinner] = useMutation(UPDATE_WINNER);
  const [updateLoser] = useMutation(UPDATE_LOSER);

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
    Promise.all([
      addGame({
        variables: { black, white, winner: winner!.id },
        refetchQueries: [{ query: USERS }],
      }),
      updateWinner({ variables: { winner: winner!.id } }),
      updateLoser({ variables: { loser } }),
    ]).then(() => onAfterSubmit(black, white));
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
    </div>
  );
};

export default AddGameForm;
