"use client";
import { createContext, useContext, useState } from "react";

const UIContext = createContext<any>(null);

export function UIProvider({ children }: any) {
  const [showClose, setShowClose] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <UIContext.Provider value={{ showClose, setShowClose,showLogin,setShowLogin }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
