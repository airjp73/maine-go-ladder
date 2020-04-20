import React from "react";
import { toast } from "react-toastify";

function reportError(message: string) {
  toast.error(
    <>
      <p>{message}</p>
      <p>
        <a href="https://github.com/airjp73/maine-go-ladder/issues">
          File an bug report
        </a>
      </p>
    </>
  );
}

export default reportError;
