"use client";

import { useState } from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import { useUI } from "./context/closebtnContext";

export default function Page() {
  const { setShowClose,showLogin,setShowLogin } = useUI();

  return (
    <>
      {!showLogin ? (
        <div className="min-h-screen w-full flex items-center justify-center">
        <Home
          onStart={() => {
            setShowLogin(true);
            setShowClose(false);
          }}
        />

        </div>
      ) : (
        <Login />
      )}
    </>
  );
}
