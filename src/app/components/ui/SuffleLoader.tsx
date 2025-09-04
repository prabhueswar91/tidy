"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ShuffleCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <motion.div
        className="w-40 h-56 cursor-pointer relative"
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full relative preserve-3d"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-yellow-400 text-black font-bold text-xl backface-hidden rounded-xl shadow-lg">
            FRONT
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-blue-500 text-white font-bold text-xl rotate-y-180 backface-hidden rounded-xl shadow-lg">
            BACK
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
