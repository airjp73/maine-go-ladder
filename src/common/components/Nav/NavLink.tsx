import { css } from "@emotion/core";
import React, { useContext } from "react";
import Link from "next/link";
import { Theme } from "../../styles/theme";
import { NavContext } from "./SlideOutPanel";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ icon, href, children }) => {
  const navContext = useContext(NavContext);

  return (
    <Link href={href}>
      <a
        css={(theme: Theme) => css`
          display: flex;
          align-items: flex-end;
          box-sizing: border-box;
          cursor: pointer;
          padding: 1rem;
          width: 100%;
          font-size: 1.5rem;
          :hover {
            background-color: ${theme.colors.blue[70].hex};
          }
        `}
        onClick={() => {
          navContext?.closeNav();
        }}
      >
        {icon}
        <span>{children}</span>
      </a>
    </Link>
  );
};

export default NavLink;
