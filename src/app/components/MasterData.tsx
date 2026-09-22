import { motion } from "motion/react";
import { MasterDataContent } from "./MasterDataContent";

export function MasterData({ defaultTab = "samsat" }: { defaultTab?: string }) {
  return (
    <div className="space-y-4 p-4 md:p-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-lg md:text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Master Data</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden sm:block">Kelola data master sistem</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MasterDataContent tab={defaultTab} />
      </motion.div>
    </div>
  );
}
