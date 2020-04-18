import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/core";
import { User } from "../resources/users/User";
import { UserItem } from "./UserItem";
import { useSelector } from "react-redux";
import { userSelectors } from "../resources/users/userSlice";

interface UserListProps extends React.ComponentProps<typeof motion.ul> {
  userEnterDelay?: number;
  onUserClick?: (user: User) => void;
  userList?: User[];
}

const UserList: React.FC<UserListProps> = ({
  onUserClick,
  userList,
  ...rest
}) => {
  const users = useSelector(userSelectors.selectAll);
  const usersToShow = userList ?? users ?? [];

  return (
    <>
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
          {usersToShow.map((user: User) => (
            <UserItem
              key={user.id}
              user={user}
              onClick={() => onUserClick?.(user)}
            />
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
};

export default UserList;
