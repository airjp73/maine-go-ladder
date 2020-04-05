import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useEffect } from "react";
import { fetchUsers } from "./userSlice";

function useUserFetch() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  // add polling
}

export default useUserFetch;
