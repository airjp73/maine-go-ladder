import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/core";
import { User } from "../api/User";
import LoadingState from "../loading/LoadingState";
import { useQuery, gql } from "@apollo/client";
import { UserItem } from "./UserItem";

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

interface UserListProps extends React.ComponentProps<typeof motion.ul> {
  userEnterDelay?: number;
  onUserClick?: (user: User) => void;
  userList?: User[];
  renderUser?: (user: User) => React.ReactNode;
}

const UserList: React.FC<UserListProps> = ({
  onUserClick,
  userList,
  renderUser,
  ...rest
}) => {
  const { loading, data: { users } = {} } = useQuery<UsersResponse>(USERS, {
    pollInterval: 10000,
  });
  const usersToShow = userList ?? users ?? [];
  const defaultRenderUser = (user: User) => (
    <UserItem key={user.id} user={user} onClick={() => onUserClick?.(user)} />
  );

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
        {...rest}
      >
        <AnimatePresence initial={false}>
          {usersToShow.map(renderUser ?? defaultRenderUser)}
        </AnimatePresence>
      </motion.ul>
    </>
  );
};

export default UserList;
