"use client";

import { useEffect } from "react";

export function AutoRefresh() {
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 60000); // 60 segundos

    return () => clearInterval(interval);
  }, []);

  return null;
}