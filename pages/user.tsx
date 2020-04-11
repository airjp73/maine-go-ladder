import React from "react";
import { useRouter } from "next/router";
import buttonStyle from "../styles/buttonStyle";
import { css } from "@emotion/core";
import PageHeader from "../components/PageHeader/PageHeader";
import Link from "next/link";
import PageContent from "../components/PageContent/PageContent";
import { User } from "../api/User";
import { rungToRating } from "../ladder/ratings";
import { Theme } from "../styles/theme";

const UserPage: React.FC = () => {
  const { query } = useRouter();

  // TODO: Use a query
  const user: User = {
    id: query.userId as string,
    ladder_rung: 22,
    name: "Jim Bob",
  };

  return (
    <PageContent
      css={css`
        padding: 1rem;
      `}
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <PageHeader header={user.name}>
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </PageHeader>
      <div
        css={(theme: Theme) => css`
          ${theme.styles.raisedBox};
          border-radius: 3px;
          margin: 0.5rem 0;

          p {
            margin: 0;
          }
        `}
      >
        <p>
          <em>Ladder Rating:</em> {rungToRating(user.ladder_rung)}
        </p>
        <p>
          {/* TODO: Add streaks */}
          <em>Current Streak:</em> 0
        </p>
      </div>
      <h3>Games:</h3>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
        <p>Game {num}</p>
      ))}
    </PageContent>
  );
};

export default UserPage;
