import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

function useDispatchInterval(
  actionCreator: () => any,
  intervalTimeout: number
): void {
  const dispatch = useDispatch();
  const action = useRef(actionCreator());

  useEffect(() => {
    action.current = actionCreator();
  }, [actionCreator]);

  useEffect(() => {
    dispatch(action.current);
    const interval = setInterval(
      () => dispatch(action.current),
      intervalTimeout
    );
    return () => clearInterval(interval);
  }, [dispatch, action]);
}

export default useDispatchInterval;
