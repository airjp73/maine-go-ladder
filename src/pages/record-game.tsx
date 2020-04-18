import React from "react";
import AddGameForm from "../games/AddGameForm";
import { useRouter } from "next/router";
import { Wrapper, Header } from "../common/components/PageContent/PageContent";
import buttonStyle from "../common/styles/buttonStyle";
import Link from "next/link";
import useDispatchEffect from "../common/util/useDispatchEffect";
import { fetchUsers, userSelectors } from "../resources/users/userSlice";
import { useSelector } from "react-redux";
import LoadingState from "../common/components/LoadingState/LoadingState";

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
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </Header>
      {loading && <LoadingState />}
      <AddGameForm
        onAfterSubmit={(black, white) =>
          router.push(`/?updated=${black}&updated=${white}`)
        }
      />
    </Wrapper>
  );
};

export default RecordGame;
