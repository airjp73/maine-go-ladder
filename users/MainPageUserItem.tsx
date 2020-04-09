import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { User } from "../api/User";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { css } from "@emotion/core";
import { rungToRating } from "../ladder/ratings";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../store/store";
import userSlice from "./userSlice";
import { Theme } from "../styles/theme";
import buttonStyle from "../styles/buttonStyle";

interface MainPageUserItemProps extends React.ComponentProps<typeof motion.li> {
  user: User;
  enterDelay?: number;
}

const containerVariants = {
  initial: { scale: 0.8, opacity: 0, x: 0 },
  entered: { scale: 1, opacity: 1, x: 0 },
  selected: { scale: 1 },
  exit: { scale: 1, opacity: 0, x: 10 },
};

const nameVariants = {
  initial: { fontSize: "1rem" },
  entered: { fontSize: "1rem" },
  selected: { fontSize: "1.25rem" },
  exit: { fontSize: "1rem" },
};

const containerStyle = (theme: Theme) => css`
  padding: 0.5rem 1rem;
  box-shadow: 1px 2px 4px ${theme.colors.blue[80].hex};
  border-radius: 3px;
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

const headingStyle = css`
  display: flex;
  align-items: center;
`;

export const MainPageUserItem: React.FC<MainPageUserItemProps> = ({
  user,
  enterDelay = 0,
  ...rest
}) => {
  const isSelected = useSelector(
    (state: AppState) => state.users.selectedUser?.id === user.id
  );
  const dispatch = useDispatch<AppDispatch>();
  const controls = useAnimation();
  const { query } = useRouter();

  useEffect(() => {
    async function animate() {
      await controls.start({ scale: 2, transition: { delay: 1 } });
      await controls.start({ scale: 1 });
    }
    if (query.updated?.includes(user.id)) {
      animate();
    }
  }, []);

  return (
    <motion.li
      css={containerStyle}
      role="button"
      tabIndex={0}
      key={user.id}
      variants={containerVariants}
      initial="initial"
      animate={isSelected ? "selected" : "entered"}
      exit="exit"
      transition={{ delay: enterDelay }}
      positionTransition={{ delay: enterDelay }}
      onClick={() => {
        if (isSelected) dispatch(userSlice.actions.deselectUser(user));
        else dispatch(userSlice.actions.selectUser(user));
      }}
      {...rest}
    >
      <motion.div css={headingStyle} variants={nameVariants}>
        <span
          css={css`
            font-weight: 600;
          `}
        >
          {user.name}
        </span>
        <motion.span
          css={css`
            position: absolute;
            right: 1rem;
            opacity: 0.75;
          `}
          animate={controls}
        >
          {rungToRating(user.ladder_rung)}
        </motion.span>
      </motion.div>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            css={css`
              overflow: hidden;
              box-sizing: border-box;
            `}
            key="userOptions"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            <div
              css={css`
                padding: 0.5rem;
                > * + * {
                  margin-left: 1rem;
                }
              `}
            >
              <button css={buttonStyle}>Calculate Matchup</button>
              <button css={buttonStyle}>View Game History</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default MainPageUserItem;
