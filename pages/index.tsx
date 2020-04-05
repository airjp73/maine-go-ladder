import React, { useEffect } from "react";
import { css } from "@emotion/core";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, AppState } from "../store/store";
import { fetchUsers, userSelectors } from "../users/userSlice";
import { Theme } from "../styles/theme";
import { motion, AnimatePresence } from "framer-motion";
import ModalButton from "../components/modal/ModalButton";
import AddGameForm from "../games/AddGameForm";
import LoadingState from "../loading/LoadingState";
import buttonStyle from "../styles/buttonStyle";
import PageHeader from "../components/PageHeader/PageHeader";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(userSelectors.selectAll);
  const isLoading = useSelector(
    (state: AppState) => !state.loading.initialDataLoaded
  );
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
      <PageHeader header="Maine Go Ladder">
        <Link href="/add-user">
          <a css={buttonStyle}>Add User</a>
        </Link>
        <ModalButton buttonLabel="Add Game Result" title="Add Game Result">
          {({ close }) => <AddGameForm onAfterSubmit={close} />}
        </ModalButton>
      </PageHeader>
      {isLoading && <LoadingState />}
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
