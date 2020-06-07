import React from "react";
import useSessionState, {
  SessionStates,
} from "../../resources/session/useSessionState";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useDispatchEffect from "./useDispatchEffect";
import { fetchSession } from "../../resources/session/sessionSlice";
import LoadingState from "../components/LoadingState/LoadingState";

function requireAuth<T>(Wrapped: React.FC<T>): React.FC<T> {
  const RequiredAuthComponent: React.FC<T> = (props) => {
    useDispatchEffect(() => fetchSession(), []);
    const sessionState = useSessionState();
    const router = useRouter();
    const isLoading = sessionState !== SessionStates.LOGGED_IN;

    useEffect(() => {
      if (sessionState === SessionStates.LOGGED_OUT) {
        router.push("/");
      }
    }, [sessionState]);

    if (isLoading) return <LoadingState />;

    return <Wrapped {...props} />;
  };

  return RequiredAuthComponent;
}

export default requireAuth;
