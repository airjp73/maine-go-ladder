import React from "react";
import buttonStyle, { disabledStyle } from "../../styles/buttonStyle";
import Link from "next/link";
import { useState } from "react";
import { Router } from "next/router";
import { Theme } from "../../styles/theme";
import { css } from "@emotion/core";

interface LinkButtonProps {
  href: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, children }) => {
  const [isLoading, setLoading] = useState(false);

  const handleLoading = () => {
    const timeout = setTimeout(() => setLoading(true), 200);
    const done = () => {
      clearTimeout(timeout);
      setLoading(false);
      Router.events.off("routeChangeComplete", done);
      Router.events.off("routeChangeError", done);
    };
    Router.events.on("routeChangeComplete", done);
    Router.events.on("routeChangeError", done);
  };

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
