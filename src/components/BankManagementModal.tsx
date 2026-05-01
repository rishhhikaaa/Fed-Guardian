/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Server, RefreshCcw, ShieldAlert, ShieldCheck, Database, BarChart3 } from 'lucide-react';
import { Bank, FraudRule, cn } from '../lib/utils';

interface BankManagementModalProps {
  bank: Bank;
  onClose: () => void;
  onUpdateRule: (bankId: string, ruleId: string, updates: Partial<FraudRule>) => void;
  onSaveAndSync: (bankId: string) => void;
  onExplainUpdate: (bank: Bank) => void;
}

export default function BankManagementModal({ bank, onClose, onUpdateRule, onSaveAndSync, onExplainUpdate }: BankManagementModalProps) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-8"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 30 }}
          className="bg-zinc-900 border border-zinc-600 max-w-6xl w-full h-[90vh] rounded-none overflow-hidden shadow-sm flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-700 flex items-center justify-between bg-zinc-950 relative z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-600 rounded-none flex items-center justify-center text-white shadow-sm">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-widest text-white uppercase">{bank.name} Control Panel</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-none bg-white shadow-sm animate-pulse" />
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">Grounded Node • Consistently Optimized</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-none transition-colors border border-zinc-950 hover:border-zinc-600"
            >
              <RefreshCcw className="w-5 h-5 rotate-45 text-zinc-500 hover:text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden grid lg:grid-cols-2">
            {/* Rules Editor */}
            <div className="p-8 overflow-y-auto border-r border-zinc-700 bg-zinc-900 scrollbar-hide">
               <div className="flex items-center justify-between mb-8">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4 text-white" /> Fraud Detention Logic
                 </h4>
                 <button 
                   onClick={() => onSaveAndSync(bank.id)}
                   className="px-6 py-2.5 bg-zinc-900 text-white border border-zinc-600 text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-zinc-800 hover:text-white shadow-sm transition-all active:scale-95"
                 >
                   Save & Distribute to Network
                 </button>
               </div>

               <div className="space-y-6">
                 {bank.rules.map((rule) => (
                   <div key={rule.id} className="bg-zinc-950/50 rounded-none border border-zinc-800 p-6 shadow-sm space-y-6 hover:border-zinc-600 transition-colors">
                     <div className="flex items-start justify-between">
                        <div className="flex-1 flex flex-col gap-1">
                          <input 
                            className="w-full text-base font-bold text-white font-mono bg-transparent border-none p-0 focus:ring-0 placeholder-zinc-600 outline-none"
                            value={rule.name}
                            onChange={(e) => onUpdateRule(bank.id, rule.id, { name: e.target.value })}
                            placeholder="Rule Name"
                          />
                          <textarea 
                            className="w-full text-xs text-zinc-500 font-mono bg-transparent border-none p-0 focus:ring-0 placeholder-zinc-700 resize-none h-10 outline-none"
                            value={rule.description}
                            onChange={(e) => onUpdateRule(bank.id, rule.id, { description: e.target.value })}
                            placeholder="Description of the fraud pattern"
                          />
                        </div>
                        <button 
                          onClick={() => onUpdateRule(bank.id, rule.id, { isActive: !rule.isActive })}
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-none border transition-colors",
                            rule.isActive ? "bg-zinc-900 border-zinc-600 text-white" : "bg-zinc-900 border-zinc-700 text-zinc-500"
                          )}
                        >
                          {rule.isActive ? "Active" : "Disabled"}
                        </button>
                     </div>

                     <div className="grid grid-cols-1 gap-8 pt-4 border-t border-zinc-800/50">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Dynamic Threshold</label>
                            <span className="text-xs font-mono font-bold text-white bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-none">{rule.threshold}</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="10000"
                            step="1"
                            value={rule.threshold}
                            onChange={(e) => onUpdateRule(bank.id, rule.id, { threshold: Number(e.target.value) })}
                            className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-white"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Node Weight (Signal Strength)</label>
                            <span className="text-xs font-mono font-bold text-white bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-none">{(rule.weight * 100).toFixed(0)}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={rule.weight}
                            onChange={(e) => onUpdateRule(bank.id, rule.id, { weight: Number(e.target.value) })}
                            className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-white"
                          />
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Grounding Data (Transactions) */}
            <div className="p-8 overflow-y-auto bg-zinc-950 scrollbar-hide">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-3">
                   <Database className="w-4 h-4 text-white" /> Evidence-Based Log
                </h4>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Observations</span>
              </div>

              <div className="space-y-3">
                {bank.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border border-zinc-800 rounded-none bg-zinc-900/30 hover:bg-zinc-900 hover:border-zinc-600 transition-all group">
                     <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-none flex items-center justify-center border",
                          tx.isFraud ? "bg-zinc-900 text-white border-zinc-700" : "bg-zinc-900 text-white border-zinc-700"
                        )}>
                          {tx.isFraud ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                             <span className="text-sm font-bold tracking-widest text-white uppercase">{tx.merchant}</span>
                             <span className="text-[9px] font-mono px-2 bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase">{tx.type}</span>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-1">
                             <span className="font-mono text-zinc-400">{tx.id}</span>
                             <span>•</span>
                             <span>{tx.location}</span>
                             <span>•</span>
                             <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right">
                       <p className={cn(
                         "text-sm font-bold font-mono tracking-widest",
                         tx.isFraud ? "text-white" : "text-white"
                       )}>${tx.amount.toLocaleString()}</p>
                       <p className={cn(
                         "text-[9px] font-bold uppercase tracking-widest mt-1",
                         tx.isFraud ? "text-zinc-400" : "text-zinc-400"
                       )}>{tx.isFraud ? "Flagged Fraud" : "Verified Clean"}</p>
                     </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                 <button 
                   onClick={() => onExplainUpdate(bank)}
                   className="w-full py-4 bg-zinc-900 border border-zinc-600 text-white rounded-none text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-white hover:shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                 >
                   <BarChart3 className="w-5 h-5" /> Analyze Counterfactuals for this Node
                 </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
