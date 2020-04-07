import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import { User } from "../api/User";
import LoadingState from "../loading/LoadingState";
import { rungToRating } from "../ladder/ratings";
import { useQuery, gql } from "@apollo/client";

export const USERS = gql`
  query {
    users(order_by: { ladder_rung: desc }) {
      id
      name
      ladder_rung
    }
  }
`;
type UsersResponse = { users: User[] };

interface UserItemProps extends React.ComponentProps<typeof motion.li> {
  user: User;
  enterDelay?: number;
}

export const UserItem: React.FC<UserItemProps> = ({
  user,
  enterDelay = 0,
  ...rest
}) => (
  <motion.li
    css={(theme: Theme) => css`
      padding: 0.5rem 1rem;
      box-shadow: 1px 2px 4px ${theme.colors.blue[80].hex};
      border-radius: 3px;
      display: flex;
      background-color: ${theme.colors.blue[90].hex};
      color: ${theme.colors.green[20].hex};
      outline: none;
      cursor: pointer;

      :hover,
      :focus {
        background-color: ${theme.colors.blue[80].hex};
        box-shadow: 2px 3px 6px ${theme.colors.blue[80].hex};
      }
    `}
    role="button"
    tabIndex={0}
    key={user.id}
    initial={{ scale: 0.8, opacity: 0, x: 0 }}
    animate={{ scale: 1, opacity: 1, x: 0 }}
    exit={{ scale: 1, opacity: 0, x: 100 }}
    transition={{ delay: enterDelay }}
    positionTransition={{ delay: enterDelay }}
    {...rest}
  >
    <span
      css={css`
        font-weight: 600;
      `}
    >
      {user.name}
    </span>
    <span
      css={css`
        margin-left: auto;
        opacity: 0.75;
      `}
    >
      {rungToRating(user.ladder_rung)}
    </span>
  </motion.li>
);

interface UserListProps extends React.ComponentProps<typeof motion.ul> {
  userEnterDelay?: number;
  onUserClick?: (user: User) => void;
  userList?: User[];
}

const UserList: React.FC<UserListProps> = ({
  userEnterDelay = 0,
  onUserClick,
  userList,
  ...rest
}) => {
  const { loading, data: { users } = {} } = useQuery<UsersResponse>(USERS, {
    pollInterval: 10000,
  });
  const usersToShow = userList ?? users ?? [];

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
          {usersToShow.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              enterDelay={userEnterDelay}
              onClick={() => onUserClick?.(user)}
            />
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
};

export default UserList;
