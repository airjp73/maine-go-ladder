import React from "react";
import { createPortal } from "react-dom";

const Portal: React.FC = ({ children }) => {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
};

export default Portal;
