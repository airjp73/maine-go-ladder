import { css } from "@emotion/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Plus, User } from "react-feather";
import {
  Wrapper,
  Header,
  Content,
} from "../common/components/PageContent/PageContent";
import NavLink from "../common/components/Nav/NavLink";
import { fetchUsers } from "../resources/users/userSlice";
import GoIcon from "../common/components/SpeedDial/GoIcon";
import SpeedDial from "../common/components/SpeedDial/SpeedDial";
import SpeedDialOption from "../common/components/SpeedDial/SpeedDialOption";
import useWindowDimensions from "../common/util/useWindowDimensions";
import MainPageUserList from "../users/MainPageUserList";
import MatchupCalculator from "../users/MatchupCalculator";
import useDispatchEffect from "../common/util/useDispatchEffect";
import SlideOutPanel from "../common/components/Nav/SlideOutPanel";

const Home: React.FC = () => {
  const router = useRouter();
  const dimensions = useWindowDimensions();
  useDispatchEffect(() => fetchUsers(), []);
  const [active, setActive] = useState(false);

  return (
    <Wrapper
      initial={{ scale: 0.9, opacity: 0, zIndex: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <Header header="Maine Go Ladder">
        <button onClick={() => setActive(true)}>Test</button>
        <SlideOutPanel active={active} onClose={() => setActive(false)}>
          <nav>
            <NavLink
              icon={
                <User
                  width="1.75rem"
                  height="1.75rem"
                  style={{ marginRight: "0.5rem" }}
                />
              }
              href="/add-user"
            >
              Add User
            </NavLink>
          </nav>
        </SlideOutPanel>
      </Header>
      <MatchupCalculator />
      <Content
        css={css`
          display: flex;
          flex-direction: column;
          text-align: center;
        `}
      >
        <MainPageUserList />
        <SpeedDial
          css={css`
            position: absolute;
            top: calc(100% - 6rem);
            right: 2rem;
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
      </Content>
    </Wrapper>
  );
};

export default Home;
