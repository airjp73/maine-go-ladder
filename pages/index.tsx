import React, { useEffect } from "react";
import { css } from "@emotion/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchUsers, userSelectors } from "../users/userSlice";
import { Theme } from "../styles/theme";
import { motion, AnimatePresence } from "framer-motion";
import ModalButton from "../components/modal/ModalButton";
import AddUserForm from "../users/AddUserForm";
import AddGameForm from "../games/AddGameForm";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(userSelectors.selectAll);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <div
      css={css`
        margin: 3rem;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        text-align: center;
      `}
    >
      <div
        css={(theme: Theme) => css`
          display: flex;
          justify-content: flex-end;
          > * + * {
            margin-left: 1rem;
          }

          > h2 {
            color: ${theme.colors.green[90].hex};
            margin: 0 auto 0 0;
          }
        `}
      >
        <h2>Maine Go Ladder</h2>
        <ModalButton buttonLabel="Add User" title="Add User">
          {({ close }) => <AddUserForm onAfterSubmit={close} />}
        </ModalButton>
        <ModalButton buttonLabel="Add Game Result" title="Add Game Result">
          {({ close }) => <AddGameForm onAfterSubmit={close} />}
        </ModalButton>
      </div>
      <ul
        css={css`
          list-style: none;
          margin: none;
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
    </div>
  );
};

export default Home;
