"use client";
import { useState, useEffect } from "react";

export default function MobileConsole() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      const logString = args.map(a => {
        try {
          return typeof a === "object" ? JSON.stringify(a) : String(a);
        } catch {
          return String(a);
        }
      }).join(" ");

      setLogs(prev => [...prev, logString]);
      originalLog(...args);
    };

    return () => {
      console.log = originalLog; 
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      maxHeight: "40%",
      overflowY: "auto",
      background: "rgba(0,0,0,0.7)",
      color: "#0f0",
      fontSize: 12,
      zIndex: 9999
    }}>
      {logs.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
}
