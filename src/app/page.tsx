"use client";

import { useState } from "react";
import Login from "./components/Login";
import Home from "./components/Home";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {!showLogin ? (
        <div className="min-h-screen w-full flex items-center justify-center">
          <Home onStart={() => setShowLogin(true)} />
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}
