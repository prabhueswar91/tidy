"use client";

import { useEffect } from "react";

export default function ErudaInit() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.async = true;
    script.onload = () => {
      window.eruda?.init();
    //   window.eruda?.show();
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
