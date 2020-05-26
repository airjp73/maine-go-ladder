import React, { useState } from "react";
import { User } from "../resources/users/User";
import ModalButton from "../common/components/Modal/ModalButton";
import { css } from "@emotion/core";
import buttonStyle from "../common/styles/buttonStyle";
import { Theme } from "../common/styles/theme";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../core/store";
import { deleteUser } from "../resources/users/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import reportError from "../common/util/reportError";

interface DeleteUserbuttonProps {
  user: User;
}

const DeleteUserButton: React.FC<DeleteUserbuttonProps> = ({ user }) => {
  const [isDeleting, setDeleting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <ModalButton title={`Delete ${user.name}`} buttonLabel="Delete User">
      {({ close }) => (
        <>
          <p>Are you sure you want to delete {user.name}?</p>
          <div
            css={css`
              display: flex;
              justify-content: flex-end;
              > * + * {
                margin-left: 1rem;
              }
            `}
          >
            {isDeleting ? (
              <span>Deleting...</span>
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
                  onClick={() => {
                    setDeleting(true);
                    dispatch(deleteUser(user.id))
                      .then(unwrapResult)
                      .then(close)
                      .catch(() => reportError("Failed to delete user"))
                      .finally(() => setDeleting(false));
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </ModalButton>
  );
};

export default DeleteUserButton;
