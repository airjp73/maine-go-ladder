import gql from "graphql-tag";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../api/User";
import fetchData from "../api/fetchData";

interface AddGamePayload {
  black_player: User;
  white_player: User;
  winner: User;
}

interface AddGameResponse {
  update_users: { returning: User[] };
}

export const addGame = createAsyncThunk(
  "games/add",
  async ({ black_player, white_player, winner }: AddGamePayload, thunkApi) => {
    const loser = winner.id === black_player.id ? white_player : black_player;
    const addGameQuery = gql`
      mutation AddGame {
        insert_games(
          objects: {
            black_player: "${black_player.id}"
            white_player: "${white_player.id}"
            winner: "${winner.id}"
          }
        ) {
          returning {
            id
          }
        }
      }
    `;

    const updateWinnerQuery = gql`
      mutation UpdateWinner {
        update_users(
          where: { id: { _eq: "${winner.id}" } }
          _inc: { ladder_rung: 1 }
        ) {
          returning {
            id
            ladder_rung
            name
          }
        }
      }
    `;

    const updateLoserQuery = gql`
      mutation UpdateLoser {
        update_users(
          where: { id: { _eq: "${loser.id}" } }
          _inc: { ladder_rung: -1 }
        ) 
      }
    `;

    try {
      const data = await fetchData<AddGameResponse>(
        [addGameQuery, updateWinnerQuery, updateLoserQuery],
        "RecordGame"
      );
      console.log(data);
      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);
