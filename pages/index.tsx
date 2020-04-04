import React from "react";
import { css } from "@emotion/core";
import { NextPage } from "next";
import graphql from "../util/graphql";

const Home: NextPage<{ users: any[] }> = ({ users = [] }) => (
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
    {users.map(user => (
      <p>
        {user.id}, {user.name}
      </p>
    ))}
  </div>
);

Home.getInitialProps = () =>
  graphql(`
    query {
      users {
        id
        name
      }
    }
  `);

export default Home;
