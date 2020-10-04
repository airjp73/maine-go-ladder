import { css } from "@emotion/core";
import { motion } from "framer-motion";
import React from "react";
import { Entity, PaginatedResponse } from "../../../types/apiTypes";
import buttonStyle from "../../styles/buttonStyle";
import listItemStyle from "../../styles/listItemStyle";
import { Theme } from "../../styles/theme";

export interface InfiniteListProps<T extends Entity> {
  canFetchMore: boolean | undefined;
  fetchMore: () => void;
  isFetching: boolean;
  items: PaginatedResponse<T>[] | undefined;
  renderItem: (item: T) => React.ReactNode;
  noMoreText?: string;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const style = {
  wrapper: css`
    > * + * {
      margin-top: 1rem;
    }
  `,
  pageWrapper: css`
    > * + * {
      margin-top: 1rem;
    }
  `,
  button: (theme: Theme) => [
    buttonStyle(theme),
    css`
      height: min-content;
      margin: 15px auto 0 auto;
    `,
  ],
  bottomArea: css`
    display: flex;
    height: 300px;
  `,
  noMoreText: css`
    margin: 0 auto;
  `,
};

const InfiniteList = <T extends Entity>({
  items,
  renderItem,
  canFetchMore,
  fetchMore,
  isFetching,
  noMoreText,
}: InfiniteListProps<T>) => {
  return (
    <div css={style.wrapper}>
      {items?.map((response) => (
        <motion.div
          key={response.page}
          css={style.pageWrapper}
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {response.items.map(renderItem)}
        </motion.div>
      ))}
      <div css={style.bottomArea}>
        {canFetchMore ? (
          <button
            css={style.button}
            disabled={isFetching}
            onClick={() => fetchMore()}
          >
            {isFetching ? "Loading..." : "Show more"}
          </button>
        ) : (
          <motion.h3
            css={style.noMoreText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {noMoreText ?? "No More Records"}
          </motion.h3>
        )}
      </div>
    </div>
  );
};

const Item = (props: React.ComponentProps<typeof motion.div>) => (
  <motion.div css={listItemStyle} variants={itemVariants} {...props} />
);

export default Object.assign(InfiniteList, { Item });
