import React, { useMemo } from "react";
import { useRouter } from "next/router";
import buttonStyle from "../common/styles/buttonStyle";
import { css } from "@emotion/core";
import Link from "next/link";
import {
  Wrapper,
  Header,
  Content,
} from "../common/components/PageContent/PageContent";
import { Game } from "../resources/games/Game";
import { rungToRating } from "../ladder/ratings";
import { Theme } from "../common/styles/theme";
import LoadingState from "../common/components/LoadingState/LoadingState";
import useDispatchEffect from "../common/util/useDispatchEffect";
import { fetchUser, userSelectors } from "../resources/users/userSlice";
import { useSelector } from "react-redux";
import { AppState } from "../core/store";

export const userItemStyle = (theme: Theme) => css`
  padding: 0.5rem 1rem;
  box-shadow: 1px 2px 4px ${theme.colors.blue[80].hex};
  border-radius: 3px;
  display: flex;
  background-color: ${theme.colors.blue[90].hex};
  color: ${theme.colors.green[20].hex};
  outline: none;
  cursor: pointer;
  align-items: center;

  :hover,
  :focus {
    background-color: ${theme.colors.blue[80].hex};
    box-shadow: 2px 3px 6px ${theme.colors.blue[80].hex};
  }
`;

const dateFormat = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "2-digit",
});
const formatDate = (dateStr: string) => dateFormat.format(new Date(dateStr));

const UserPage: React.FC = () => {
  const { query } = useRouter();
  const userId = Array.isArray(query.userId) ? query.userId[0] : query.userId;
  useDispatchEffect(() => fetchUser(userId), [userId]);
  const user = useSelector((state: AppState) =>
    userSelectors.selectById(state, userId)
  );
  const games: Game[] =
    useMemo(
      () =>
        user?.games &&
        [...user.games].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      [user]
    ) ?? [];

  if (!user) return <LoadingState />;

  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header={user.name ?? "User"}>
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </Header>
      <Content
        css={css`
          display: flex;
          flex-direction: column;
          padding: 1rem;
        `}
      >
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
            <strong>Ladder Rating:</strong> {rungToRating(user.ladder_rung)}
          </p>
          <p>
            {/* TODO: Add streaks */}
            <strong>Current Streak:</strong> {user.streak}
          </p>
        </div>
        <h3>Games:</h3>
        <div
          css={css`
            overflow: auto;
            flex: 1;
            height: 200px;
            > * + * {
              margin-top: 1rem;
            }
          `}
        >
          {games.map((game) => (
            <div css={userItemStyle}>
              <div>
                <p>
                  <strong>Black:</strong> {game.black.name}
                </p>
                <p>
                  <strong>White:</strong> {game.white.name}
                </p>
                <p>
                  <strong>Uploaded:</strong> {formatDate(game.created_at)}
                </p>
              </div>
              <span
                css={(theme: Theme) => css`
                  margin-left: auto;
                  font-size: 1.5rem;
                  color: ${game.winner === user.id
                    ? theme.colors.highlight
                    : theme.colors.green[60].hex};
                `}
              >
                {game.winner === user.id ? "Won" : "Lost"}
              </span>
            </div>
          ))}
        </div>
      </Content>
    </Wrapper>
  );
};

export default UserPage;
