import React from "react";
import { useForm } from "react-hook-form";
import { css } from "@emotion/core";
import buttonStyle from "../common/styles/buttonStyle";
import { ratingtoRung } from "../ladder/ratings";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../core/store";
import { postUser } from "../resources/users/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import reportError from "../common/util/reportError";
import { fieldStyle, errorStyle } from "../common/styles/fieldStyle";

interface AddUserFormProps {
  onAfterSubmit: () => void;
}

interface FormData {
  name: string;
  rating: string;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onAfterSubmit }) => {
  const {
    handleSubmit,
    register,
    errors,
    formState: { isSubmitting },
    setError,
    clearError,
  } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        const ladder_rung = ratingtoRung(parseFloat(values.rating));
        await dispatch(postUser({ name: values.name, ladder_rung }))
          .then(unwrapResult)
          .then(() => onAfterSubmit())
          .catch(() => reportError("Failed to create user"));
      })}
      css={css`
        display: flex;
        flex-direction: column;

        > * {
          margin-top: 1rem;
        }

        > button {
          margin-top: 2rem;
        }
      `}
    >
      <div css={fieldStyle}>
        <label>Name</label>

        <input name="name" ref={register({ required: true })} required />
        {errors.name && <span css={errorStyle}>{errors.name.message}</span>}
      </div>

      <div css={fieldStyle}>
        <label>Rating</label>
        <input
          name="rating"
          type="number"
          step="0.1"
          required
          ref={register({ required: true })}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            const rung = ratingtoRung(parseFloat(target.value));
            if (!Number.isInteger(rung))
              setError(
                "rating",
                "not-valid-ladder-rung",
                "This rating is not a valid rung on the ladder."
              );
            else clearError("rating");
          }}
        />
        {errors.rating && <span css={errorStyle}>{errors.rating.message}</span>}
      </div>

      <button css={buttonStyle} disabled={isSubmitting}>
        {isSubmitting ? "Creating User..." : "Submit"}
      </button>
    </form>
  );
};

export default AddUserForm;
