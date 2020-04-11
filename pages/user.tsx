import React, { useMemo } from "react";
import { useRouter } from "next/router";
import buttonStyle from "../styles/buttonStyle";
import { css } from "@emotion/core";
import PageHeader from "../components/PageHeader/PageHeader";
import Link from "next/link";
import PageContent from "../components/PageContent/PageContent";
import { User, UserWithGames, Game } from "../api/User";
import { rungToRating } from "../ladder/ratings";
import { Theme } from "../styles/theme";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LoadingState from "../loading/LoadingState";

const USER_GAMES_QUERY = gql`
  query UserWithGames($user: uuid!) {
    users_by_pk(id: $user) {
      games_as_black {
        id
        black {
          id
          name
        }
        white {
          id
          name
        }
        winning_user {
          id
          name
        }
        created_at
      }
      games_as_white {
        id
        black {
          id
          name
        }
        white {
          id
          name
        }
        winning_user {
          id
          name
        }
        created_at
      }
      id
      ladder_rung
      name
    }
  }
`;

const UserPage: React.FC = () => {
  const { query } = useRouter();
  const { loading, data, error } = useQuery<{ users_by_pk: UserWithGames }>(
    USER_GAMES_QUERY,
    { variables: { user: query.userId } }
  );

  const user = data?.users_by_pk!;
  const games: Game[] = useMemo(
    () =>
      user?.games_as_black
        .concat(user.games_as_white)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
    [user]
  );

  if (!user) return <LoadingState />;

  return (
    <PageContent
      css={css`
        padding: 1rem;
      `}
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <PageHeader header={user?.name ?? "User"}>
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </PageHeader>
      {loading && <LoadingState />}
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
      {games.map((game) => (
        <p>{game.id}</p>
      ))}
    </PageContent>
  );
};

export default UserPage;
