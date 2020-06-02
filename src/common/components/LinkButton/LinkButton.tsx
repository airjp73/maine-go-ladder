import React, { useCallback } from "react";
import buttonStyle, { disabledStyle } from "../../styles/buttonStyle";
import Link from "next/link";
import { useState } from "react";
import { Router } from "next/router";
import { Theme } from "../../styles/theme";
import { css } from "@emotion/core";

interface LinkButtonProps {
  href: string;
}

export function usePageTransition(): [boolean, () => Promise<void>] {
  const [isLoading, setLoading] = useState(false);

  const handleLoading = useCallback(() => {
    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => setLoading(true), 200);
      const done = () => {
        clearTimeout(timeout);
        setLoading(false);
        resolve();
        Router.events.off("routeChangeComplete", done);
        Router.events.off("routeChangeError", done);
      };
      Router.events.on("routeChangeComplete", done);
      Router.events.on("routeChangeError", done);
    });
  }, []);

  return [isLoading, handleLoading];
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, children }) => {
  const [isLoading, handleLoading] = usePageTransition();

  return (
    <Link href={href}>
      <a
        css={(theme: Theme) => css`
          ${buttonStyle(theme)}
          ${isLoading && disabledStyle(theme)}
        `}
        onClick={(event) => {
          event.stopPropagation();
          handleLoading();
        }}
      >
        {isLoading ? "Loading..." : children}
      </a>
    </Link>
  );
};

export default LinkButton;
