import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../core/store";
import {
  ladderSelectors,
  getLadderHistoryForUser,
} from "../resources/ladder-history/ladderSlice";

const RatingHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const history = useSelector((state: AppState) =>
    getLadderHistoryForUser(state, userId)
  );
  return (
    <div>
      {history.map((item) => (
        <p>{item.ladder_rung}</p>
      ))}
    </div>
  );
};

export default RatingHistory;
