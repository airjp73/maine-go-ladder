import React, { useRef, useEffect } from "react";
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
import { userSelectors, fetchUsers } from "../resources/users/userSlice";
import { useSelector } from "react-redux";
import { AppState } from "../core/store";
import { fetchGames, gameSelectors } from "../resources/games/gameSlice";
import { User } from "../resources/users/User";
import LoadingStates from "../common/enum/LoadingStates";
import RatingHistory from "../ladder/RatingHistory";
import { fetchLadderHistory } from "../resources/ladder-history/ladderSlice";

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

const GameItem: React.FC<{ game: Game; user: User }> = ({ user, game }) => (
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
);

/**
 * The values of the query params are always for the current page.
 * When we transition to another page, we want to keep the old ones around.
 * @param paramName the name of the query param
 */
const useQueryParam = (paramName: string) => {
  const { query } = useRouter();
  const param = query[paramName];
  const paramRef = useRef<string | string[]>(param);
  useEffect(() => {
    if (param) paramRef.current = param;
  }, [param]);
  return paramRef.current;
};

const UserPage: React.FC = () => {
  const userIdParam = useQueryParam("userId");
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
  useDispatchEffect(() => userId && fetchGames(userId), [userId]);
  useDispatchEffect(() => fetchUsers(), []);
  useDispatchEffect(() => fetchLadderHistory(userId), [userId]);
  const user = useSelector((state: AppState) =>
    userSelectors.selectById(state, userId)
  );
  const games: Game[] = useSelector((state: AppState) =>
    gameSelectors
      .selectAll(state)
      .filter(
        (game) => game.black.id === user?.id || game.white.id === user?.id
      )
  );

  // TODO: keep loading states per user
  const isLoading = useSelector(
    (state: AppState) =>
      state.users.loading !== LoadingStates.COMPLETE ||
      state.games.loading[userId] !== LoadingStates.COMPLETE ||
      state.ladderHistory.loading[userId] !== LoadingStates.COMPLETE
  );

  if (isLoading) return <LoadingState />;

  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header={user ? user.name : "User not found"}>
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </Header>
      {user && (
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
              <strong>Current Streak:</strong> {user.streak}
            </p>
          </div>
          <h3>Rating History:</h3>
          <RatingHistory userId={user.id} />
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
              <GameItem key={game.id} game={game} user={user} />
            ))}
          </div>
        </Content>
      )}
    </Wrapper>
  );
};

export default UserPage;
