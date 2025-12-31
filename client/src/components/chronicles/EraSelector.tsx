import React from 'react';
import { motion } from 'framer-motion';

interface Era {
  id: string;
  name: string;
  years: string;
  icon: string;
  description?: string;
}

interface EraSelectorProps {
  eras: Era[];
  selected: string | null;
  onSelect: (eraId: string) => void;
}

export const EraSelector: React.FC<EraSelectorProps> = ({ eras, selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-testid="era-selector">
      {eras.map((era, index) => (
        <motion.button
          key={era.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(era.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`relative p-6 rounded-xl border transition-all ${
            selected === era.id
              ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
          }`}
          data-testid={`era-card-${era.id}`}
        >
          <div className="text-4xl mb-3">{era.icon}</div>
          <div className="text-white font-semibold text-lg">{era.name}</div>
          <div className="text-sm text-slate-400 mt-1">{era.years}</div>
          {selected === era.id && (
            <motion.div
              layoutId="era-check"
              className="absolute top-2 right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center"
            >
              <span className="text-slate-900 text-sm">✓</span>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default EraSelector;
