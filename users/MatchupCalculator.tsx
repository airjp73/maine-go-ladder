import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../store/store";
import userSlice, { UserStates } from "./userSlice";
import { AnimatePresence, motion } from "framer-motion";
import UserItem from "./UserItem";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import buttonStyle from "../styles/buttonStyle";
import AnimateHeight from "../components/AnimateHeight/AnimateHeight";
import type { User } from "../api/User";
import { rungToRating } from "../ladder/ratings";
import opacify from "../styles/opacify";

interface EvenMatchup {
  type: "EVEN";
}
interface HandicapMatchup {
  type: "HANDICAP";
  black: User;
  white: User;
  numStones: number;
  komi: number;
}
type Matchup = EvenMatchup | HandicapMatchup;

function calculateMatchup(user1: User, user2: User): Matchup {
  if (user1.ladder_rung === user2.ladder_rung) return { type: "EVEN" };

  const [black, white] =
    user1.ladder_rung > user2.ladder_rung ? [user2, user1] : [user1, user2];

  const blackRating = rungToRating(black.ladder_rung);
  const whiteRating = rungToRating(white.ladder_rung);
  // TODO: use the correct calculations
  const numStones = Math.round(whiteRating - blackRating);
  const komi = -0.5;
  return { type: "HANDICAP", black, white, numStones, komi };
}

const matchupStyle = css`
  margin: 0;
`;

const MatchupCalculator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: AppState) => state.users.currentState);
  const user1 = useSelector((state: AppState) => state.users.selectedUser);
  const user2 = useSelector((state: AppState) => state.users.matchup);
  const matchup: Matchup | null =
    user1 && user2 ? calculateMatchup(user1, user2) : null;

  return (
    <AnimatePresence>
      {mode === UserStates.MATCHUP && (
        <motion.div
          css={css`
            overflow: hidden;
          `}
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          key="matchup-mode-section"
        >
          <div
            css={(theme: Theme) => css`
              padding: 1rem;
              background-color: ${theme.colors.green[40].hex};
              box-shadow: 1px 2px 2px ${opacify(theme.colors.green[90], 0.75)};
              margin: 0.5rem 0;
              border-radius: 3px;
              > * + * {
                margin-top: 1rem;
              }
            `}
          >
            {user1 && <UserItem user={user1} />}
            {user2 && <UserItem user={user2} />}
            {!user2 && (
              <div
                css={css`
                  border: 1px solid black;
                  border-radius: 3px;
                  padding: 0.5rem 1rem;
                  text-align: left;
                `}
              >
                Choose another player
              </div>
            )}
            <AnimatePresence>
              {matchup && (
                <AnimateHeight
                  key="matchup-info"
                  height={matchup.type === "EVEN" ? "1.5rem" : "9rem"}
                >
                  {matchup.type === "EVEN" && (
                    <p css={matchupStyle}>Even Game</p>
                  )}
                  {matchup.type === "HANDICAP" && (
                    <>
                      <p>{matchup.black.name} is black</p>
                      <p>{matchup.white.name} is white</p>
                      <p>{matchup.numStones} handicap stones</p>
                      <p>{matchup.komi} komi</p>
                    </>
                  )}
                </AnimateHeight>
              )}
            </AnimatePresence>
            <button
              css={buttonStyle}
              onClick={() => dispatch(userSlice.actions.cancelMatchup())}
            >
              Close Matchup Calculator
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchupCalculator;
