import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EraSelector from './EraSelector';
import EmotionAxes from './EmotionAxes';

const ERAS = [
  { id: 'ancient', name: 'Ancient Era', years: '3000 BCE - 500 CE', icon: '🏛️' },
  { id: 'medieval', name: 'Medieval Era', years: '500 - 1500', icon: '⚔️' },
  { id: 'renaissance', name: 'Renaissance', years: '1400 - 1600', icon: '🎨' },
  { id: 'industrial', name: 'Industrial Age', years: '1760 - 1840', icon: '⚙️' },
  { id: 'modern', name: 'Modern Era', years: '1900 - 2000', icon: '🏙️' },
  { id: 'future', name: 'Future', years: '2100+', icon: '🚀' },
];

const EMOTION_AXES = [
  { id: 'courage', positive: 'Courage', negative: 'Fear' },
  { id: 'hope', positive: 'Hope', negative: 'Despair' },
  { id: 'trust', positive: 'Trust', negative: 'Suspicion' },
  { id: 'passion', positive: 'Passion', negative: 'Apathy' },
  { id: 'wisdom', positive: 'Wisdom', negative: 'Recklessness' },
];

interface CharacterData {
  era: string;
  emotions: Record<string, number>;
  name: string;
  backstory: string;
}

interface CharacterCreatorProps {
  onComplete: (character: CharacterData) => void;
  onCancel?: () => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [era, setEra] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<Record<string, number>>({
    courage: 50, hope: 50, trust: 50, passion: 50, wisdom: 50
  });
  const [name, setName] = useState('');
  const [backstory, setBackstory] = useState('');

  const canProceed = () => {
    if (step === 1) return era !== null;
    if (step === 2) return true;
    if (step === 3) return name.trim().length >= 2;
    return true;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    if (!era) return;
    onComplete({ era, emotions, name: name.trim(), backstory: backstory.trim() });
  };

  const selectedEra = ERAS.find(e => e.id === era);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8" data-testid="character-creator">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Create Your Parallel Self</h1>
          <p className="text-slate-400">Step {step} of 4</p>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-cyan-400' : 'bg-slate-700'
                }`}
                data-testid={`progress-step-${s}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              data-testid="step-era"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Choose Your Era</h2>
              <p className="text-slate-400 mb-6">Select the time period where your parallel self will exist.</p>
              <EraSelector eras={ERAS} selected={era} onSelect={setEra} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              data-testid="step-emotions"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Define Your Core Beliefs</h2>
              <p className="text-slate-400 mb-6">Adjust the sliders to shape your parallel self's personality.</p>
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <EmotionAxes
                  axes={EMOTION_AXES}
                  values={emotions}
                  onChange={(id, value) => setEmotions(prev => ({ ...prev, [id]: value }))}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              data-testid="step-identity"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Your Identity</h2>
              <p className="text-slate-400 mb-6">Give your parallel self a name and backstory.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter a name..."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Backstory (optional)</label>
                  <textarea
                    value={backstory}
                    onChange={(e) => setBackstory(e.target.value)}
                    placeholder="What shaped your parallel self? What drives them?"
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none resize-none"
                    data-testid="input-backstory"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              data-testid="step-review"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Review Your Parallel Self</h2>
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{selectedEra?.icon}</div>
                  <div>
                    <div className="text-white font-semibold text-lg">{name}</div>
                    <div className="text-slate-400">{selectedEra?.name} ({selectedEra?.years})</div>
                  </div>
                </div>
                {backstory && (
                  <div className="pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-400 mb-1">Backstory</div>
                    <div className="text-white">{backstory}</div>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-400 mb-2">Personality Profile</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {EMOTION_AXES.map(axis => {
                      const val = emotions[axis.id];
                      const label = val < 50 ? axis.negative : axis.positive;
                      const pct = Math.abs(val - 50) * 2;
                      return (
                        <div key={axis.id} className="flex justify-between">
                          <span className="text-slate-400">{label}</span>
                          <span className="text-white">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-8">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-6 rounded-lg border border-slate-700 text-white hover:bg-slate-800 transition-colors"
              data-testid="button-back"
            >
              Back
            </button>
          ) : onCancel ? (
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-6 rounded-lg border border-slate-700 text-white hover:bg-slate-800 transition-colors"
              data-testid="button-cancel"
            >
              Cancel
            </button>
          ) : null}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 py-3 px-6 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              data-testid="button-next"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-400 hover:to-purple-400 transition-colors"
              data-testid="button-create"
            >
              Create Parallel Self
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
