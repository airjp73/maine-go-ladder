import React, { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { css } from "@emotion/core";
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
import LinkButton from "../common/components/LinkButton/LinkButton";
import listItemStyle from "../common/styles/listItemStyle";
import LabelledValue from "../common/components/LabelledValue/LabelledValue";
import DeleteUserButton from "../users/DeleteUserButton";
import useSessionState, {
  SessionStates,
} from "../resources/session/useSessionState";

const dateFormat = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "2-digit",
});
const formatDate = (dateStr: string) => dateFormat.format(new Date(dateStr));

const GameItem: React.FC<{ game: Game; user: User }> = ({ user, game }) => (
  <div css={listItemStyle}>
    <div>
      <LabelledValue label="Black" value={game.black.name} />
      <LabelledValue label="White" value={game.white.name} />
      <LabelledValue label="Uploaded" value={formatDate(game.created_at)} />
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
  const sessionState = useSessionState();
  const userIdParam = useQueryParam("userId");
  const { push } = useRouter();
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
        <LinkButton href="/">Home</LinkButton>
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
              display: flex;

              p {
                margin: 0;
              }
            `}
          >
            <div>
              <p>
                <strong>Ladder Rating:</strong> {rungToRating(user.ladder_rung)}
              </p>
              <p>
                <strong>Current Streak:</strong> {user.streak}
              </p>
            </div>
            <div
              css={css`
                margin-left: auto;
              `}
            >
              {sessionState === SessionStates.LOGGED_IN && (
                <DeleteUserButton user={user} onAfterDelete={() => push("/")} />
              )}
            </div>
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
