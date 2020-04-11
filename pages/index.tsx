import { css } from "@emotion/core";
import { useRouter } from "next/router";
import React from "react";
import { Plus, User } from "react-feather";
import PageContent from "../components/PageContent/PageContent";
import PageHeader from "../components/PageHeader/PageHeader";
import GoIcon from "../components/SpeedDial/GoIcon";
import SpeedDial from "../components/SpeedDial/SpeedDial";
import SpeedDialOption from "../components/SpeedDial/SpeedDialOption";
import useWindowDimensions from "../util/useWindowDimensions";
import MainPageUserList from "../users/MainPageUserList";
import MatchupCalculator from "../users/MatchupCalculator";

const Home: React.FC = () => {
  const router = useRouter();
  const dimensions = useWindowDimensions();

  return (
    <PageContent
      css={css`
        display: flex;
        flex-direction: column;
        padding: 1rem 1rem 0 1rem;
        text-align: center;
      `}
      initial={{ scale: 0.9, opacity: 0, zIndex: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <PageHeader header="Maine Go Ladder" />
      <MatchupCalculator />
      <MainPageUserList />
      <SpeedDial
        css={css`
          position: absolute;
          top: calc(100% - 6rem);
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
