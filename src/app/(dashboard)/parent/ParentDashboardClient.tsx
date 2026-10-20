"use client";

import { motion } from "framer-motion";

export default function ParentDashboardClient({
  studentId,
  children,
}: {
  studentId: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key={studentId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}