import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { userSelectors } from "./userSlice";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";

interface UserListProps {
  userEnterDelay: number;
}
const UserList: React.FC<UserListProps> = ({ userEnterDelay }) => {
  const users = useSelector(userSelectors.selectAll);
  return (
    <ul
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
        {users.map((user) => (
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
            transition={{ delay: userEnterDelay }}
            positionTransition
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
              {user.rating}
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};

export default UserList;
