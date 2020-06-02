import React from "react";
import { motion } from "framer-motion";
import { User } from "../resources/users/User";
import { css } from "@emotion/core";
import { rungToRating } from "../ladder/ratings";
import listItemStyle from "../common/styles/listItemStyle";

interface UserItemProps extends React.ComponentProps<typeof motion.li> {
  user: User;
}

export const UserItem: React.FC<UserItemProps> = ({ user, ...rest }) => (
  <motion.li
    css={listItemStyle}
    role="button"
    tabIndex={0}
    key={user.id}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
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
        position: absolute;
        right: 1rem;
        opacity: 0.75;
      `}
    >
      {rungToRating(user.ladder_rung)}
    </span>
  </motion.li>
);

export default UserItem;
