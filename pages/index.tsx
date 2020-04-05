import React, { useEffect } from "react";
import { css } from "@emotion/core";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, AppState } from "../store/store";
import { fetchUsers, userSelectors } from "../users/userSlice";
import { Theme } from "../styles/theme";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, User } from "react-feather";
import LoadingState from "../loading/LoadingState";
import buttonStyle from "../styles/buttonStyle";
import PageHeader from "../components/PageHeader/PageHeader";
import PageContent from "../components/PageContent/PageContent";
import SpeedDial from "../components/SpeedDial/SpeedDial";
import SpeedDialOption from "../components/SpeedDial/SpeedDialOption";
import GoIcon from "../components/SpeedDial/GoIcon";
import { useRouter } from "next/router";
import useWindowDimensions from "../util/useWindowDimensions";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(userSelectors.selectAll);
  const isLoading = useSelector(
    (state: AppState) => !state.loading.initialDataLoaded
  );
  const userHasNavigated = useSelector(
    (state: AppState) => state.loading.userHasNavigated
  );
  const router = useRouter();
  const dimensions = useWindowDimensions();
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <PageContent
      css={css`
        display: flex;
        flex-direction: column;
        padding: 1rem;
        text-align: center;
      `}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
    >
      <PageHeader header="Maine Go Ladder" />
      {isLoading && <LoadingState />}
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
              transition={{ delay: userHasNavigated ? 0.35 : 0 }}
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
      <SpeedDial
        css={css`
          position: absolute;
          top: calc(100% - 5rem);
          right: 3rem;
          transition: top 0.25s ease 1s, bottom 0.25s ease 1s;

          @media only screen and (min-width: 1000px) {
            bottom: unset;
            top: 2rem;
          }
        `}
        icon={<Plus />}
        direction={dimensions.width >= 1000 ? "DOWN" : "UP"}
      >
        <SpeedDialOption
          label="Add User"
          onClick={() => router.push("/add-user")}
        >
          <User />
        </SpeedDialOption>
        <SpeedDialOption label="Record Game">
          <GoIcon height={25} width={25} />
        </SpeedDialOption>
      </SpeedDial>
    </PageContent>
  );
};

export default Home;
