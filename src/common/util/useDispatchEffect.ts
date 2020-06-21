import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

function useDispatchEffect(actionCreator: () => any, deps: any[]): void {
  const dispatch = useDispatch();
  const action = useMemo(actionCreator, deps);
  useEffect(() => {
    if (action) dispatch(action);
  }, [dispatch, action]);
}

export default useDispatchEffect;
