import { css } from "@emotion/core";
import Head from "next/head";

const Home: React.FC = () => (
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
    <h1>Hi</h1>
  </div>
);

export default Home;
