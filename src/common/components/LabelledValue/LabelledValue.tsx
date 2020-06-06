import React from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import { Theme } from "../../styles/theme";

interface LabelledValueProps {
  label: string;
  value: string;
  href?: string;
}

const LabelledValue: React.FC<LabelledValueProps> = ({
  label,
  value,
  href,
}) => (
  <p>
    <strong>{label}:</strong>{" "}
    {href ? (
      <Link href={href}>
        <a
          css={(theme: Theme) => css`
            color: ${theme.colors.blue[40].hex};
          `}
        >
          {value}
        </a>
      </Link>
    ) : (
      value
    )}
  </p>
);

export default LabelledValue;
