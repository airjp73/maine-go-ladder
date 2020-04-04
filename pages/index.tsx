import React, { useEffect } from "react";
import { css } from "@emotion/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchUsers, userSelectors } from "../users/userSlice";
import { Theme } from "../styles/theme";
import AddUserButton from "../users/AddUserButton";

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
        css={css`
          display: flex;
        `}
      >
        <AddUserButton />
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
        {users.map((user) => (
          <li
            css={(theme: Theme) => css`
              padding: 0.5rem 1rem;
              box-shadow: 1px 2px 4px ${theme.colors.blue[80].hex};
              border-radius: 3px;
              display: flex;
              background-color: ${theme.colors.blue[90].hex};
              color: ${theme.colors.green[20].hex};
            `}
            key={user.id}
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
