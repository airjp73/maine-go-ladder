import React, { useEffect } from "react";
import { css } from "@emotion/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchUsers, userSelectors } from "../users/userSlice";

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
            css={css`
              padding: 0.5rem 1rem;
              box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
              border-radius: 3px;
              display: flex;
            `}
            key={user.id}
          >
            <span
              css={css`
                font-weight: bold;
              `}
            >
              {user.name}
            </span>{" "}
            <span
              css={css`
                margin-left: auto;
                color: rgba(0, 0, 0, 0.5);
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
