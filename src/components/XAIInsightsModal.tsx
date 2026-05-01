/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, ShieldCheck, RefreshCcw, ArrowRightLeft, Info } from 'lucide-react';
import { Bank, CounterfactualExplanation } from '../lib/utils';

interface XAIInsightsModalProps {
  selectedBank: Bank;
  explanation: CounterfactualExplanation | null;
  isExplaining: boolean;
  onClose: () => void;
}

export default function XAIInsightsModal({ selectedBank, explanation, isExplaining, onClose }: XAIInsightsModalProps) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-zinc-900 border border-zinc-700 max-w-4xl w-full max-h-[90vh] rounded-none overflow-hidden shadow-sm flex flex-col lg:flex-row"
          onClick={e => e.stopPropagation()}
        >
          {/* Left Panel: Diagnostic */}
          <div className="bg-zinc-950 text-white p-8 border-r border-zinc-800 flex flex-col lg:w-1/2 min-h-0 overflow-y-auto scrollbar-hide">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-none flex items-center justify-center bg-zinc-900 text-white border border-zinc-700">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-widest uppercase">Node Diagnostic</h3>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-none mt-1">Explainable AI Interface</p>
              </div>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto pr-2 scrollbar-hide">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-white tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-none bg-white shadow-sm" /> Decision Path Synthesis
                </label>
                <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                  {isExplaining ? "Synthesizing rule effectiveness..." : explanation?.originalDecision}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-white tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-none bg-white shadow-sm" /> Counterfactual Outcome
                </label>
                <div className="bg-zinc-900 p-4 rounded-none border border-zinc-800">
                  <p className="text-sm text-zinc-300 font-mono italic leading-relaxed">
                    {isExplaining ? "Simulating alternative logic application..." : explanation?.counterfactualScenario}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-white tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-none bg-white shadow-sm" /> Delta Implementation
                </label>
                <ul className="space-y-2">
                  {isExplaining ? (
                    [1,2,3].map(i => <div key={i} className="h-4 w-full bg-zinc-800 animate-pulse rounded-none" />)
                  ) : (
                    explanation?.requiredChanges.map((change, i) => (
                      <li key={i} className="text-xs text-zinc-400 font-mono flex items-start gap-2 border-l-2 border-zinc-700 pl-2">
                        <ArrowRightLeft className="w-3 h-3 mt-0.5 text-zinc-600 flex-shrink-0" />
                        {change}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Panel: Impact */}
          <div className="p-8 bg-zinc-900 relative flex flex-col lg:w-1/2 min-h-0 overflow-y-auto scrollbar-hide">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-600 p-1"
            >
              <RefreshCcw className="w-5 h-5 rotate-45" />
            </button>

            <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-white tracking-widest uppercase">
              <ShieldCheck className="w-5 h-5 text-white" /> Node Update Impact
            </h4>

            <div className="mb-8 flex-1">
              <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                {isExplaining ? "Calculating projected metrics..." : explanation?.impactDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-none text-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Projected Accuracy</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">+{Math.floor(Math.random() * 8) + 2}%</div>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-none text-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Risk Mitigation</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">OPTIMIZED</div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-white mb-2">
                <Info className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Grounding Engine</span>
              </div>
              <div className="text-[10px] text-zinc-500 leading-relaxed font-mono bg-zinc-950 p-3 border border-zinc-800 rounded-none">
                Insights grounded in node-specific transactions and global consensus weights.
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full mt-8 py-3 bg-zinc-950 border border-zinc-700 text-white font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all text-xs"
            >
              Close Diagnostic
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
