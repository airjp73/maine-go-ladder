enum LoadingStates {
  "IDLE" = "IDLE",
  "LOADING" = "LOADING",
  "COMPLETE" = "COMPLETE",
}

export interface UserLoadingState {
  [userId: string]: LoadingStates | undefined;
}

export default LoadingStates;
