"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className=" bg-[#141318] border-2 border-[#333333] text-white rounded-xl shadow-lg w-full max-w-md p-6 relative m-8">
        <button
          onClick={onClose}
          id="testtttttttttttt"
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
