import React from "react";
import AddGameForm from "../games/AddGameForm";
import { useRouter } from "next/router";
import { Wrapper, Header } from "../common/components/PageContent/PageContent";
import useDispatchEffect from "../common/util/useDispatchEffect";
import { fetchUsers, userSelectors } from "../resources/users/userSlice";
import { useSelector } from "react-redux";
import LoadingState from "../common/components/LoadingState/LoadingState";
import LinkButton from "../common/components/LinkButton/LinkButton";

const RecordGame: React.FC = () => {
  const router = useRouter();
  useDispatchEffect(() => fetchUsers(), []);
  const users = useSelector(userSelectors.selectAll);
  const loading = !users.length;

  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header="Record Game">
        <LinkButton href="/">Home</LinkButton>
      </Header>
      {loading && <LoadingState />}
      <AddGameForm onAfterSubmit={() => router.push("/")} />
    </Wrapper>
  );
};

export default RecordGame;
