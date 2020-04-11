import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/core";
import { User } from "../api/User";
import LoadingState from "../loading/LoadingState";
import { useQuery, gql } from "@apollo/client";
import MainPageUserItem from "./MainPageUserItem";
import { useSelector } from "react-redux";
import { AppState } from "../store/store";
import { UserStates } from "./userSlice";

export const USERS = gql`
  query {
    users(order_by: { ladder_rung: desc, name: asc }) {
      id
      name
      ladder_rung
    }
  }
`;
type UsersResponse = { users: User[] };

const MainPageUserList: React.FC = () => {
  const { loading, data: { users } = {} } = useQuery<UsersResponse>(USERS, {
    pollInterval: 10000,
  });
  const mode = useSelector((state: AppState) => state.users.currentState);
  const selectedUser = useSelector(
    (state: AppState) => state.users.selectedUser
  );
  const matchupUser = useSelector((state: AppState) => state.users.matchup);

  const userIsInMatchup = (user: User) =>
    user.id === selectedUser?.id || user.id === matchupUser?.id;

  return (
    <>
      {loading && <LoadingState />}
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
