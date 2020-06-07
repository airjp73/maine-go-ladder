import { AppState } from "../../core/store";
import { useSelector } from "react-redux";
import LoadingStates from "../../common/enum/LoadingStates";

export enum SessionStates {
  LOGGED_IN = "LOGGED_IN",
  LOADING = "LOADING",
  LOGGED_OUT = "LOGGED_OUT",
}

function useSessionState(): SessionStates {
  const { session, loading } = useSelector((state: AppState) => state.session);

  if (loading !== LoadingStates.COMPLETE) return SessionStates.LOADING;
  if (session) return SessionStates.LOGGED_IN;
  return SessionStates.LOGGED_OUT;
}

export default useSessionState;
