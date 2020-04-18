import React from "react";
import { useTheme } from "emotion-theming";
import { Theme } from "../../styles/theme";

const GoIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = (
  props
) => {
  const theme = useTheme<Theme>();
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="kifu.io"
      height={25}
      width={25}
      {...props}
    >
      <circle cx="25" cy="25" r="20" fill={theme.colors.highlightSecondary} />
      <circle cx="25" cy="75" r="20" fill={theme.colors.dark} />
      <circle cx="75" cy="25" r="20" fill={theme.colors.dark} />
      <circle cx="75" cy="75" r="20" fill={theme.colors.highlightSecondary} />
    </svg>
  );
};

export default GoIcon;
