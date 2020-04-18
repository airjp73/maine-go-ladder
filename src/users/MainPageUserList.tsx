import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/core";
import { User } from "../resources/users/User";
import LoadingState from "../common/components/LoadingState/LoadingState";
import MainPageUserItem from "./MainPageUserItem";
import { useSelector } from "react-redux";
import { AppState } from "../core/store";
import { UserStates } from "./mainPageSlice";
import { userSelectors } from "../resources/users/userSlice";

const MainPageUserList: React.FC = () => {
  const users = useSelector(userSelectors.selectAll);
  const mode = useSelector((state: AppState) => state.mainPage.currentState);
  const selectedUser = useSelector(
    (state: AppState) => state.mainPage.selectedUser
  );
  const matchupUser = useSelector((state: AppState) => state.mainPage.matchup);

  const userIsInMatchup = (user: User) =>
    user.id === selectedUser?.id || user.id === matchupUser?.id;

  return (
    <>
      {!users.length && <LoadingState />}
      <motion.ul
        css={css`
          list-style: none;
          margin: 0;
          padding: 1rem 1rem 10rem 1rem;
          overflow: auto;
          flex: 1;

          > * + * {
            margin-top: 1rem;
          }
        `}
      >
        <AnimatePresence initial={false}>
          {users
            ?.filter(
              (user) => mode !== UserStates.MATCHUP || !userIsInMatchup(user)
            )
            .map((user) => (
              <MainPageUserItem key={user.id} user={user} />
            ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
};

export default MainPageUserList;
