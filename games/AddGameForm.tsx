import React from "react";
import { useForm } from "react-hook-form";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { unwrapResult } from "@reduxjs/toolkit";

interface AddGameFormProps {
  onAfterSubmit: () => void;
}

interface FormData {
  name: string;
  rating: number;
}

const field = (theme: Theme) => css`
  > * + * {
    margin-left: 0.5rem;
  }
`;

const error = css`
  font-size: 0.5rem;
  color: red;
`;

const AddGameForm: React.FC<AddGameFormProps> = ({ onAfterSubmit }) => {
  const { handleSubmit, register, errors } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <form
      onSubmit={handleSubmit((values) => {
        // dispatch(
        //   () => {}
        // )
        //   .then(unwrapResult)
        //   .then(() => onAfterSubmit());
      })}
      css={css`
        > * {
          margin-top: 1rem;
        }
      `}
    >
      <h4>In Progress</h4>

      <div>
        <button>Submit</button>
      </div>
    </form>
  );
};

export default AddGameForm;
