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
import { fetchGames, GAMES_QUERY } from "../resources/games/gameSlice";
import { User } from "../resources/users/User";
import LoadingStates from "../common/enum/LoadingStates";
import RatingHistory from "../ladder/RatingHistory";
import { fetchLadderHistory } from "../resources/ladder-history/ladderSlice";
import LinkButton from "../common/components/LinkButton/LinkButton";
import LabelledValue from "../common/components/LabelledValue/LabelledValue";
import DeleteUserButton from "../users/DeleteUserButton";
import InfiniteList from "../common/components/InfiniteList/InfiniteList";
import useSessionState, {
  SessionStates,
} from "../resources/session/useSessionState";
import { useInfiniteQuery } from "react-query";
import EditUserForm from "../users/EditUserForm";
import ModalButton from "../common/components/Modal/ModalButton";

const dateFormat = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "2-digit",
});
const formatDate = (dateStr: string) => dateFormat.format(new Date(dateStr));

const GameItem: React.FC<{ game: Game; user: User }> = ({ user, game }) => (
  <InfiniteList.Item>
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
  </InfiniteList.Item>
);

/**
 * The values of the query params are always for the current page.
 * When we transition to another page, we want to keep the old ones around.
 * @param paramName the name of the query param
 */
const useQueryParam = (paramName: string) => {
  const { query } = useRouter();
  const param = query[paramName];
  const paramRef = useRef<string | string[] | undefined>(param);
  useEffect(() => {
    if (param) paramRef.current = param;
  }, [param]);
  return paramRef.current ?? param;
};

const UserPage: React.FC = () => {
  const sessionState = useSessionState();
  const userIdParam = useQueryParam("userId");
  const { push } = useRouter();
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

  const {
    isLoading: areGamesLoading,
    data: games,
    fetchMore,
    isFetching,
    canFetchMore,
  } = useInfiniteQuery([GAMES_QUERY, userId], fetchGames, {
    enabled: !!userId,
    getFetchMore: (lastResponse) =>
      lastResponse.hasMore && lastResponse.page + 1,
  });

  useDispatchEffect(() => fetchUsers(), []);
  useDispatchEffect(() => userId && fetchLadderHistory(userId), [userId]);
  const user = useSelector(
    (state: AppState) => userId && userSelectors.selectById(state, userId)
  );

  const isLoading = useSelector(
    (state: AppState) =>
      state.users.loading !== LoadingStates.COMPLETE ||
      areGamesLoading ||
      (userId && state.ladderHistory.loading[userId] !== LoadingStates.COMPLETE)
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
            overflow: hidden;
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
            <div
              css={css`
                > p {
                  margin-top: 1rem;
                }
              `}
            >
              <h3
                css={css`
                  margin: 0;
                `}
              >
                {user.name}
              </h3>
              <p>
                <strong>Ladder Rating:</strong> {rungToRating(user.ladder_rung)}
              </p>
              <p>
                <strong>Current Streak:</strong> {user.streak}
              </p>
              <p>
                <strong>Added to ladder:</strong> {formatDate(user.created_at)}
              </p>
            </div>
            <div
              css={css`
                margin-left: auto;
              `}
            >
              {sessionState === SessionStates.LOGGED_IN && (
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                  `}
                >
                  <ModalButton
                    title={`Change ${user.name}'s name`}
                    buttonLabel="Change Name"
                  >
                    {({ close }) => (
                      <EditUserForm user={user} onAfterSave={close} />
                    )}
                  </ModalButton>
                  <DeleteUserButton
                    user={user}
                    onAfterDelete={() => push("/")}
                  />
                </div>
              )}
            </div>
          </div>
          <h3>Rating History:</h3>
          <RatingHistory userId={user.id} />
          <h3>Games:</h3>
          <InfiniteList
            items={games}
            canFetchMore={canFetchMore}
            fetchMore={fetchMore}
            isFetching={isFetching}
            renderItem={(game) => (
              <GameItem key={game.id} game={game} user={user} />
            )}
            noMoreText="No more games"
          />
        </Content>
      )}
    </Wrapper>
  );
};

export default UserPage;
