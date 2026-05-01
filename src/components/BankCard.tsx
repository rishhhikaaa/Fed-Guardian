/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ChevronRight, BarChart3 } from 'lucide-react';
import { Bank } from '../lib/utils';

interface BankCardProps {
  bank: Bank;
  onViewBank: (bankId: string) => void;
  onExplainUpdate: (bank: Bank) => void;
}

export default function BankCard({ bank, onViewBank, onExplainUpdate }: BankCardProps) {
  return (
    <motion.div 
      layoutId={bank.id}
      className="bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden hover:border-zinc-500 transition-all border-l-4"
      style={{ borderLeftColor: bank.color }}
    >
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
        <div className="flex flex-col">
          <h4 className="text-sm font-bold tracking-widest text-white uppercase">{bank.name}</h4>
          <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-1">ID: {bank.id}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] text-zinc-500 font-bold uppercase leading-none tracking-widest">Accuracy</p>
            <p className="text-lg font-bold tracking-widest leading-none mt-1.5 text-white">{bank.performanceScore}%</p>
          </div>
          <button 
            onClick={() => onViewBank(bank.id)}
            className="p-1.5 hover:bg-zinc-800 rounded-none transition-colors border border-zinc-700 hover:border-white"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="p-5 bg-zinc-900/50">
        <div className="space-y-4">
          {bank.rules.slice(0, 2).map((rule) => (
            <div key={rule.id} className="bg-zinc-950 p-3 rounded-none border border-zinc-800 group hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold uppercase text-white tracking-widest">{rule.name}</span>
                <span className="text-[9px] font-mono text-white px-1.5 py-0.5 bg-zinc-900 rounded-none border border-zinc-800">Thr: {rule.threshold}</span>
              </div>
              <p className="text-[10px] text-zinc-400 line-clamp-1">{rule.description}</p>
            </div>
          ))}
          
          <div className="pt-2 flex items-center gap-3">
            <button 
              onClick={() => onExplainUpdate(bank)}
              className="flex-1 py-2 text-[9px] font-bold uppercase tracking-widest bg-zinc-900 text-white border border-zinc-600 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              XAI Insights <BarChart3 className="w-3 h-3" />
            </button>
            <button 
              onClick={() => onViewBank(bank.id)}
              className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all"
            >
              Local Rules
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
