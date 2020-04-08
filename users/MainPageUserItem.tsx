import { motion, useAnimation } from "framer-motion";
import { User } from "../api/User";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { css } from "@emotion/core";
import { rungToRating } from "../ladder/ratings";
import { userItemStyle } from "./UserItem";

interface MainPageUserItemProps extends React.ComponentProps<typeof motion.li> {
  user: User;
  enterDelay?: number;
}

export const MainPageUserItem: React.FC<MainPageUserItemProps> = ({
  user,
  enterDelay = 0,
  ...rest
}) => {
  const controls = useAnimation();
  const { query } = useRouter();

  useEffect(() => {
    async function animate() {
      await controls.start({ scale: 2, transition: { delay: 1 } });
      await controls.start({ scale: 1 });
    }
    if (query.updated?.includes(user.id)) {
      animate();
    }
  }, []);

  return (
    <motion.li
      css={userItemStyle}
      role="button"
      tabIndex={0}
      key={user.id}
      initial={{ scale: 0.8, opacity: 0, x: 0 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 1, opacity: 0, x: 100 }}
      transition={{ delay: enterDelay }}
      positionTransition={{ delay: enterDelay }}
      {...rest}
    >
      <span
        css={css`
          font-weight: 600;
        `}
      >
        {user.name}
      </span>
      <motion.span
        css={css`
          position: absolute;
          right: 1rem;
          opacity: 0.75;
        `}
        animate={controls}
      >
        {rungToRating(user.ladder_rung)}
      </motion.span>
    </motion.li>
  );
};

export default MainPageUserItem;
