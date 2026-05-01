/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Activity, Server, Database } from 'lucide-react';
import { Bank } from '../lib/utils';

interface NetworkTopologyProps {
  banks: Bank[];
  isAggregating: boolean;
  onSelectBank: (bankId: string) => void;
}

export default function NetworkTopology({ banks, isAggregating, onSelectBank }: NetworkTopologyProps) {
  return (
    <section id="network-topology" className="col-span-12 lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden flex flex-col h-[600px] shadow-sm">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">Collective Intelligence Node Map</h2>
        </div>
        <div className="text-[10px] font-mono text-zinc-500 uppercase">Grounded in local transaction subsets</div>
      </div>

      <div className="flex-1 relative bg-grid shadow-inner overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950/80 z-0 mix-blend-multiply" />
        {/* Center Aggregator */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
          animate={isAggregating ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-24 h-24 bg-zinc-950 shadow-sm flex items-center justify-center border-2 border-white relative">
            <Database className="text-white w-10 h-10 drop-shadow-sm" />
            <div className="absolute -top-3 -right-3 bg-zinc-900 border border-white text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest">HUB</div>
          </div>
          <span className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/80 bg-zinc-950 px-2 border border-zinc-800">FedGuardian Core</span>
        </motion.div>

        {/* Connecting Lines & Dynamic Particles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#888888" />
              <stop offset="100%" stopColor="#444444" />
            </linearGradient>
          </defs>
          {banks.map((bank, index) => {
            const angle = (index / banks.length) * 2 * Math.PI - Math.PI / 2;
            const r = 35; // percentage radius
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            return (
              <g key={`line-${bank.id}`}>
                <motion.line
                  x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`}
                  stroke="#444" strokeWidth="1" strokeDasharray="2 4"
                />
                <AnimatePresence>
                  {isAggregating && (
                    <motion.circle
                      r="2" fill="#fff"
                      initial={{ opacity: 1, offset: 0 }}
                      animate={{
                        cx: [`${x}%`, "50%", `${x}%`],
                        cy: [`${y}%`, "50%", `${y}%`]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>

        {/* Bank Nodes */}
        {banks.map((bank, index) => {
          const angle = (index / banks.length) * 2 * Math.PI - Math.PI / 2;
          const r = 35; // percentage radius
          const x = 50 + Math.cos(angle) * r * (100 / 100);
          const y = 50 + Math.sin(angle) * r;
          return (
            <motion.div
              key={bank.id}
              className="absolute z-30 cursor-pointer group transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelectBank(bank.id)}
            >
              <div className="w-20 h-20 bg-zinc-950 border border-zinc-700 shadow-lg flex flex-col items-center justify-center group-hover:border-white group-hover:shadow-sm transition-all">
                <Server className="w-6 h-6 mb-1 text-zinc-500 group-hover:text-white" />
                <span className="text-[8px] font-bold uppercase text-center px-1 line-clamp-1 text-zinc-300 group-hover:text-white">{bank.name}</span>
                <div className="mt-1 flex gap-1">
                  <div className="w-1.5 h-3 bg-zinc-800 group-hover:bg-white transition-colors" />
                  <div className="w-1.5 h-2 bg-zinc-800 group-hover:bg-zinc-500 transition-colors" />
                  <div className="w-1.5 h-4 bg-zinc-800 group-hover:bg-white transition-colors" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 grid grid-cols-4 gap-4 border-t border-zinc-800 bg-zinc-950">
        <div className="flex flex-col border-r border-zinc-800 pr-4">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Avg. Node Accuracy</span>
          <span className="text-xl font-bold tracking-widest text-white">{Math.round(banks.reduce((acc, b) => acc + b.performanceScore, 0) / banks.length)}%</span>
        </div>
        <div className="flex flex-col border-r border-zinc-800 px-4">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Global Fraud Rate</span>
          <span className="text-xl font-bold tracking-widest text-white">{(banks.reduce((acc, b) => acc + b.fraudRate, 0) / banks.length).toFixed(1)}%</span>
        </div>
        {/* <div className="flex flex-col border-r border-zinc-800 px-4">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Local Observations</span>
          <span className="text-xl font-bold tracking-widest text-white">{(banks.reduce((acc, b) => acc + b.localDataCount, 0) / 1000).toFixed(1)}k</span>
        </div> */}
        {/* <div className="flex flex-col pl-4">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Sync State</span>
          <span className="text-xl font-bold tracking-widest text-white animate-pulse">CONSENSUS</span>
        </div> */}
      </div>
    </section>
  );
}
