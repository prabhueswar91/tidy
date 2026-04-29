"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Logo from "../assets/Logo.png";

export default function MaintenancePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0f0f0f] px-6 text-center"
    >

      <div className="w-32 h-32 relative mb-6">
        <Image src={Logo} alt="Logo" fill className="object-contain" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        We’ll Be Back Soon 🚧
      </h1>

      <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
        Our platform is currently undergoing scheduled maintenance to improve
        performance and user experience. Please check back shortly.
      </p>

      <div className="absolute bottom-5 text-xs text-gray-600">
        © {new Date().getFullYear()} Powered by JunglCorp & TidyCoin.
      </div>
    </motion.div>
  );
}