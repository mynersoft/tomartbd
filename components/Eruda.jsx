"use client";

import { useEffect } from "react";

export default function Eruda() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.async = true;

    script.onload = () => {
      window.eruda?.init();
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
      window.eruda?.destroy();
    };
  }, []);

  return null;
}