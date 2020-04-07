import React from "react";
import { useForm } from "react-hook-form";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import { USERS } from "./UserList";
import buttonStyle from "../styles/buttonStyle";
import { ratingtoRung } from "../ladder/ratings";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

const ADD_USER = gql`
  mutation AddUser($name: String!, $rung: Int!) {
    insert_users(objects: { name: $name, ladder_rung: $rung }) {
      returning {
        id
        name
        ladder_rung
      }
    }
  }
`;

interface AddUserFormProps {
  onAfterSubmit: () => void;
}

interface FormData {
  name: string;
  rating: string;
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

const error = (theme: Theme) => css`
  font-size: 1rem;
  font-weight: bold;
`;

const AddUserForm: React.FC<AddUserFormProps> = ({ onAfterSubmit }) => {
  const {
    handleSubmit,
    register,
    errors,
    formState,
    setError,
    clearError,
  } = useForm<FormData>();
  const [addUser] = useMutation(ADD_USER);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const ladderRung = ratingtoRung(parseFloat(values.rating));
        addUser({
          variables: {
            name: values.name,
            rung: ladderRung,
          },
          refetchQueries: [{ query: USERS }],
        }).then(() => onAfterSubmit());
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
      <div css={field}>
        <label>Name</label>

        <input name="name" ref={register({ required: true })} />
        {errors.name && <span css={error}>{errors.name.message}</span>}
      </div>

      <div css={field}>
        <label>Rating</label>
        <input
          name="rating"
          type="number"
          step="0.1"
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
        {errors.rating && <span css={error}>{errors.rating.message}</span>}
      </div>

      <button css={buttonStyle} disabled={formState.isSubmitting}>
        Submit
      </button>
    </form>
  );
};

export default AddUserForm;
