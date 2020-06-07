import React from "react";
import { useForm } from "react-hook-form";
import { fieldStyle, errorStyle } from "../common/styles/fieldStyle";
import { useDispatch } from "react-redux";
import { login } from "../resources/session/sessionSlice";
import { AppDispatch } from "../core/store";
import { unwrapResult } from "@reduxjs/toolkit";
import reportError from "../common/util/reportError";
import { useRouter } from "next/router";
import buttonStyle from "../common/styles/buttonStyle";
import {
  Wrapper,
  Header,
  Content,
} from "../common/components/PageContent/PageContent";
import LinkButton from "../common/components/LinkButton/LinkButton";
import { css } from "@emotion/core";

const LoginPage: React.FC = () => {
  const {
    handleSubmit,
    register,
    errors,
    formState: { isSubmitting },
  } = useForm<{ password: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header="Log In">
        <LinkButton href="/">Home</LinkButton>
      </Header>
      <Content
        css={css`
          padding: 1rem;
        `}
      >
        <form
          onSubmit={handleSubmit(({ password }) => {
            dispatch(login({ password }))
              .then(unwrapResult)
              .then(() => router.push("/"))
              .catch(() => reportError("Incorrect Password"));
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
            <label>Password</label>

            <input
              name="password"
              ref={register({ required: true })}
              type="password"
              required
            />
            {errors.password && (
              <span css={errorStyle}>{errors.password.message}</span>
            )}
          </div>

          <button css={buttonStyle} disabled={isSubmitting}>
            {isSubmitting ? "Logging in" : "Log In"}
          </button>
        </form>
      </Content>
    </Wrapper>
  );
};

export default LoginPage;
