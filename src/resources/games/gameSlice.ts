import { createAsyncThunk } from "@reduxjs/toolkit";
import { NewGame } from "./Game";

export const postGame = createAsyncThunk<void, NewGame>(
  "users/post",
  async (payload) => {
    await fetch("/api/record-game", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });
  }
);
