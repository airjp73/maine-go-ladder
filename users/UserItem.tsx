import { motion } from "framer-motion";
import { User } from "../apiTypes/User";
import { Theme } from "../styles/theme";
import { css } from "@emotion/core";
import { rungToRating } from "../ladder/ratings";

interface UserItemProps extends React.ComponentProps<typeof motion.li> {
  user: User;
}

export const userItemStyle = (theme: Theme) => css`
  padding: 0.5rem 1rem;
  box-shadow: 1px 2px 4px ${theme.colors.blue[80].hex};
  border-radius: 3px;
  display: flex;
  background-color: ${theme.colors.blue[90].hex};
  color: ${theme.colors.green[20].hex};
  outline: none;
  cursor: pointer;
  position: relative;

  :hover,
  :focus {
    background-color: ${theme.colors.blue[80].hex};
    box-shadow: 2px 3px 6px ${theme.colors.blue[80].hex};
  }
`;

export const UserItem: React.FC<UserItemProps> = ({ user, ...rest }) => (
  <motion.li
    css={userItemStyle}
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
