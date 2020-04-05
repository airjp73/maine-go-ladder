import { useState, useEffect } from "react";
import useWindowResizeCallback from "./useWindowResizeCallback";

interface WindowDimensions {
  width: number;
  height: number;
}

function useWindowDimensions(): WindowDimensions {
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useWindowResizeCallback(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  });

  return dimensions;
}

export default useWindowDimensions;
