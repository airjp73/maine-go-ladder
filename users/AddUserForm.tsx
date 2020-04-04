import React from "react";
import { useForm } from "react-hook-form";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";

interface AddUserFormProps {
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

const AddUserForm: React.FC<AddUserFormProps> = ({ onAfterSubmit }) => {
  const { handleSubmit, register, errors } = useForm<FormData>();
  console.log(errors);
  return (
    <form
      onSubmit={handleSubmit((values) => {
        console.log(values);
        onAfterSubmit();
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

      <div>
        <button>Submit</button>
      </div>
    </form>
  );
};

export default AddUserForm;
