import React from "react";
import { User } from "../resources/users/User";
import { css } from "@emotion/core";
import buttonStyle from "../common/styles/buttonStyle";
import { Theme } from "../common/styles/theme";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../core/store";
import { renameUser } from "../resources/users/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import reportError from "../common/util/reportError";
import { useForm } from "react-hook-form";
import { errorStyle, fieldStyle } from "../common/styles/fieldStyle";

interface EditUserFormProps {
  user: User;
  onAfterSave?: () => void;
}

interface FormData {
  name: string;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onAfterSave }) => {
  const {
    handleSubmit,
    register,
    errors,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: { name: user.name },
  });
  const dispatch = useDispatch<AppDispatch>();

  return (
    <form
      onSubmit={handleSubmit(async ({ name }) => {
        await dispatch(renameUser({ id: user.id, name }))
          .then(unwrapResult)
          .then(() => {
            onAfterSave?.();
          })
          .catch(() => reportError("Failed to update name"));
      })}
    >
      <div css={[fieldStyle, css({ marginTop: "1rem" })]}>
        <label>New Name</label>

        <input name="name" ref={register({ required: true })} required />
        {errors.name && <span css={errorStyle}>{errors.name.message}</span>}
      </div>
      <div
        css={css`
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
          > * + * {
            margin-left: 1rem;
          }
        `}
      >
        {isSubmitting ? (
          <span>Saving...</span>
        ) : (
          <>
            <button
              css={(theme: Theme) =>
                buttonStyle({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    green: theme.colors.blue,
                  },
                })
              }
              onClick={close}
              type="button"
            >
              Cancel
            </button>
            <button
              css={(theme: Theme) =>
                buttonStyle({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    green: theme.colors.blue,
                  },
                })
              }
              type="submit"
            >
              Update
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default EditUserForm;
