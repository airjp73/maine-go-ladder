import React from "react";
import AddUserForm from "../users/AddUserForm";
import { useRouter } from "next/router";
import { css } from "@emotion/core";
import PageHeader from "../components/PageHeader/PageHeader";
import Link from "next/link";
import buttonStyle from "../styles/buttonStyle";
import { motion } from "framer-motion";
import { Theme } from "../styles/theme";

const AddUser: React.FC = () => {
  const router = useRouter();
  return (
    <motion.div
      css={(theme: Theme) => css`
        padding: 1rem;
        max-width: 750px;
        margin: 0 auto;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: ${theme.colors.background};
      `}
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%" }}
    >
      <PageHeader header="Add User">
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </PageHeader>
      <AddUserForm onAfterSubmit={() => router.push("/")} />
    </motion.div>
  );
};

export default AddUser;
