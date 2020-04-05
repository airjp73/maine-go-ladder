import React from "react";
import { useForm } from "react-hook-form";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import { useDispatch } from "react-redux";
import { addUser } from "./userSlice";
import { AppDispatch } from "../store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import buttonStyle from "../styles/buttonStyle";

interface AddUserFormProps {
  onAfterSubmit: () => void;
}

interface FormData {
  name: string;
  rating: number;
}

const field = (theme: Theme) => css`
  label {
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  > * {
    display: block;
  }
`;

const error = css`
  font-size: 0.5rem;
  color: red;
`;

const AddUserForm: React.FC<AddUserFormProps> = ({ onAfterSubmit }) => {
  const { handleSubmit, register, errors, formState } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  console.log(formState.isSubmitting);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        return dispatch(
          addUser({
            name: values.name,
            rating: values.rating,
          })
        )
          .then(unwrapResult)
          .then(() => onAfterSubmit());
      })}
      css={css`
        > * {
          margin-top: 1rem;
        }
      `}
    >
      <div css={field}>
        <label>Name</label>

        <input name="name" ref={register({ required: true })} />
        {errors.name?.type === "required" && (
          <span css={error}>This field is required</span>
        )}
      </div>

      <div css={field}>
        <label>Rating</label>
        <input
          name="rating"
          type="number"
          step="0.01"
          ref={register({ required: true })}
        />
        {errors.rating?.type === "required" && (
          <span css={error}>This field is required</span>
        )}
      </div>

      <button css={buttonStyle} disabled={formState.isSubmitting}>
        Submit
      </button>
    </form>
  );
};

export default AddUserForm;
