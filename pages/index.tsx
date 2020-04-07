import { css } from "@emotion/core";
import { useRouter } from "next/router";
import React from "react";
import { Plus, User } from "react-feather";
import { useSelector } from "react-redux";
import PageContent from "../components/PageContent/PageContent";
import PageHeader from "../components/PageHeader/PageHeader";
import GoIcon from "../components/SpeedDial/GoIcon";
import SpeedDial from "../components/SpeedDial/SpeedDial";
import SpeedDialOption from "../components/SpeedDial/SpeedDialOption";
import { AppState } from "../store/store";
import UserList from "../users/UserList";
import useWindowDimensions from "../util/useWindowDimensions";

const Home: React.FC = () => {
  const userHasNavigated = useSelector(
    (state: AppState) => state.loading.userHasNavigated
  );
  const router = useRouter();
  const dimensions = useWindowDimensions();

  return (
    <PageContent
      css={css`
        display: flex;
        flex-direction: column;
        padding: 1rem;
        text-align: center;
      `}
      initial={{ scale: 0.9, zIndex: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
    >
      <PageHeader header="Maine Go Ladder" />
      <UserList userEnterDelay={userHasNavigated ? 1 : 0} />
      <SpeedDial
        css={css`
          position: absolute;
          top: calc(100% - 5rem);
          right: 3rem;
          transition: top 0.25s ease 1s, bottom 0.25s ease 1s;

          @media only screen and (min-width: 1000px) {
            bottom: unset;
            top: 2rem;
          }
        `}
        icon={<Plus />}
        direction={dimensions.width >= 1000 ? "DOWN" : "UP"}
      >
        <SpeedDialOption
          label="Add User"
          onClick={() => router.push("/add-user")}
        >
          <User />
        </SpeedDialOption>
        <SpeedDialOption
          label="Record Game"
          onClick={() => router.push("/record-game")}
        >
          <GoIcon />
        </SpeedDialOption>
      </SpeedDial>
    </PageContent>
  );
};

export default Home;
