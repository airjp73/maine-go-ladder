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
  MEDIUM: "3rem",
  SMALL: "2.5rem",
};

const Fab: React.FC<FabProps> = forwardRef(
  ({ highlighted, size = "MEDIUM", ...rest }, ref) => {
    const theme = useTheme<Theme>();
    const highlightColor = theme.colors.blue[20].hex;

    const inactiveSvg = css`
      filter: drop-shadow(1px 1px 2px ${highlightColor});
      transform: scale(1);
    `;

    const activeSvg = css`
      filter: drop-shadow(2px 2px 5px ${highlightColor});
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
          background-color: ${theme.colors.blue[90].hex};
          height: ${size && sizeDimensions[size]};
          width: ${size && sizeDimensions[size]};
          border: none;
          border-radius: 50%;
          outline: none;
          color: ${highlightColor};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 1px 2px 4px ${theme.colors.blue[80].hex};
          transition: transform 0.25s ease;

          ${highlighted && breathingSvg} :hover {
            box-shadow: 2px 3px 6px ${theme.colors.blue[80].hex};
            transform: scale(1.05);

            svg {
              ${activeSvg}
            }
          }
        `}
        ref={ref}
        {...rest}
      />
    );
  }
);

export default Fab;
