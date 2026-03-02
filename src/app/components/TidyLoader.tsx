"use client";

import { motion, Variants } from "framer-motion";
import BgCard from "../assets/card-1.png";

const text = "Loading TidyZen...";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      repeat: Infinity,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.8 },
  show: {
    opacity: [0.5, 1, 0.5],
    y: [0, -5, 0],
    scale: [1, 1.2, 1],
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "easeInOut",
    },
  },
};

export default function TidyLoader() {
  return (
    <div className="relative w-full flex min-h-screen items-center justify-center font-dm text-[#FFFEEF] overflow-hidden">
      <img
        src={BgCard.src}
        alt="Background Card"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="flex flex-col items-center justify-center text-center px-4">
        {/* <div className="flex justify-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 flex items-center justify-center text-2xl shadow-lg"
            animate={{ rotateY: [0, 360] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          >
            ₮
          </motion.div>
        </div> */}
       <motion.div
  className="relative mb-8"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>

          <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full"></div>

          <motion.img
  src="/animations/tidycoin.png"
  className="w-40 md:w-52 relative z-10 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]"
  animate={{ rotateY: 360 }}
  transition={{
    repeat: Infinity,
    duration: 1.6,
    ease: "linear",
  }}
  style={{
    transformStyle: "preserve-3d",
    background: "transparent",
  }}
/>
        </motion.div>
        <motion.h1
          className="text-white text-xl font-bold tracking-widest flex flex-wrap justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {text.split("").map((char, i) => (
            <motion.span key={i} variants={letterVariants}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        <p className="mt-3 text-xs text-gray-400">
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
}
