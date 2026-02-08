"use client";

import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

const FullScreenSwitch = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (typeof document !== "undefined") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const handleFullScreenChange = () => {
    if (typeof document !== "undefined") {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      }
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("fullscreenchange", handleFullScreenChange);

      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullScreenChange,
        );
      };
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsFullScreen(!!document.fullscreenElement);
    }
  }, []);

  return (
    <button
      onClick={handleFullScreen}
      className="bg-transparent cursor-pointer border-2 border-sapphire/60 hover:border-sapphire text-sapphire/60 hover:text-sapphire font-bold p-2 rounded-lg duration-500"
    >
      {isFullScreen ? <Minimize /> : <Maximize />}
    </button>
  );
};

export default FullScreenSwitch;
