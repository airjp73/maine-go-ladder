import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

function useDispatchEffect(actionCreator: () => any, deps: any[]) {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const action = useMemo(actionCreator, deps);
  useEffect(() => {
    if (action) dispatch(action).then(setLoading(false));
  }, [dispatch, action]);
  return isLoading;
}

export default useDispatchEffect;
