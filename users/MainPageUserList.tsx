import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/core";
import { User } from "../api/User";
import LoadingState from "../loading/LoadingState";
import { useQuery, gql } from "@apollo/client";
import MainPageUserItem from "./MainPageUserItem";

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

  return (
    <>
      {loading && <LoadingState />}
      <motion.ul
        css={css`
          list-style: none;
          margin: 0 0 10rem 0;
          padding: 1rem;

          > * + * {
            margin-top: 1rem;
          }
        `}
      >
        <AnimatePresence initial={false}>
          {users?.map((user: User) => (
            <MainPageUserItem key={user.id} user={user} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
};

export default MainPageUserList;
