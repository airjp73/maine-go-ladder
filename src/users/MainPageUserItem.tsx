import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { User } from "../resources/users/User";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { css } from "@emotion/core";
import { rungToRating } from "../ladder/ratings";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../core/store";
import mainPageSlice from "./mainPageSlice";
import { Theme } from "../common/styles/theme";
import buttonStyle from "../common/styles/buttonStyle";
import AnimateHeight from "../common/components/AnimateHeight/AnimateHeight";
import DeleteUserButton from "./DeleteUserButton";

interface MainPageUserItemProps extends React.ComponentProps<typeof motion.li> {
  user: User;
}

const containerVariants = {
  initial: { scale: 0.8, opacity: 0 },
  entered: { scale: 1, opacity: 1 },
  selected: { scale: 1 },
  exit: { scale: 0.8, opacity: 0 },
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
  ...rest
}) => {
  const isSelected = useSelector(
    (state: AppState) => state.mainPage.selectedUser?.id === user.id
  );
  const dispatch = useDispatch<AppDispatch>();
  const controls = useAnimation();
  const { query, push } = useRouter();

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
      positionTransition
      onClick={() => {
        if (isSelected) dispatch(mainPageSlice.actions.deselectUser(user));
        else dispatch(mainPageSlice.actions.selectUser(user));
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
      <AnimatePresence initial={false}>
        {isSelected && (
          <AnimateHeight key="userOptions">
            <div
              css={css`
                display: flex;
                justify-content: center;
                padding: 1rem 0.5rem;

                @media only screen and (min-width: 750px) {
                  > * + * {
                    margin-left: 1rem;
                  }
                }

                @media only screen and (max-width: 749px) {
                  flex-direction: column;
                  > * + * {
                    margin-top: 1rem;
                  }
                }
              `}
            >
              <button
                css={buttonStyle}
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch(mainPageSlice.actions.calculateMatchup());
                }}
              >
                Calculate Matchup
              </button>
              <button
                css={buttonStyle}
                onClick={(event) => {
                  event.stopPropagation();
                  push(`/user?userId=${user.id}`);
                }}
              >
                View Game History
              </button>
              <DeleteUserButton user={user} />
            </div>
          </AnimateHeight>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default MainPageUserItem;