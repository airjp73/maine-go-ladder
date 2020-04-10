import { keyframes, css } from "@emotion/core";
import { motion } from "framer-motion";
import { Theme } from "../../styles/theme";
import { useTheme } from "emotion-theming";
import { forwardRef } from "react";

interface FabProps extends React.ComponentProps<typeof motion.button> {
  highlighted?: boolean;
  size?: "MEDIUM" | "SMALL";
}

const sizeDimensions = {
  MEDIUM: "4rem",
  SMALL: "3rem",
};

const Fab: React.FC<FabProps> = forwardRef(
  ({ highlighted, size = "MEDIUM", ...rest }, ref) => {
    const theme = useTheme<Theme>();

    const inactiveSvg = css`
      filter: drop-shadow(1px 1px 2px ${theme.colors.highlightSecondary});
      transform: scale(1);
    `;

    const activeSvg = css`
      filter: drop-shadow(2px 2px 5px ${theme.colors.highlightSecondary});
      transform: scale(1.15);
      stroke-width: 2.5;
    `;

    const breathe = keyframes`
      0% { ${inactiveSvg} } 
      50% { ${activeSvg} } 
      100% { ${inactiveSvg} } 
    `;

    const breathingSvg = css`
      :not(:hover) {
        svg {
          animation: ${breathe} 2s infinite;
        }
      }
    `;

    return (
      <motion.button
        css={css`
          background-color: ${theme.colors.highlight};
          height: ${size && sizeDimensions[size]};
          width: ${size && sizeDimensions[size]};
          border: none;
          border-radius: 50%;
          outline: none;
          color: ${theme.colors.dark};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 1px 2px 4px ${theme.colors.dark};
          transition: transform 0.25s ease;

          ${highlighted && breathingSvg} :hover {
            box-shadow: 2px 3px 6px ${theme.colors.dark};
            transform: scale(1.05);

            svg {
              ${activeSvg}
            }
          }

          :disabled {
            box-shadow: none;
            opacity: 0.5;
          }
        `}
        ref={ref}
        {...rest}
      />
    );
  }
);

export default Fab;
