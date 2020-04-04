import React, { useEffect } from "react";
import { css } from "@emotion/core";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../store/store";
import { fetchUsers } from "../users/userSlice";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: AppState) => state.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  console.log(users);

  return (
    <div
      css={css`
        margin: 3rem;
        display: flex;
        flex-direction: column;
        border: 1px solid grey;
        padding: 1rem;
        text-align: center;
      `}
    >
      {users.map((user) => (
        <p key={user.id}>
          {user.id}, {user.name}
        </p>
      ))}
    </div>
  );
};

export default Home;
