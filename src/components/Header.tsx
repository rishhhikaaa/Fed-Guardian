/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  isAggregating: boolean;
  onSyncNetwork: () => void;
}

export default function Header({ isAggregating, onSyncNetwork }: HeaderProps) {
  return (
    <header className="border-b border-zinc-700 px-8 py-4 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-900 rounded-none border border-zinc-600 flex items-center justify-center">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-widest text-white uppercase shadow-zinc-600 drop-shadow-md">FedGuardian AI</h1>
          <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Decentralized Fraud Prevention Network</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white rounded-none border border-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse" />
            Network Active
          </div>
          <div className="text-zinc-700">|</div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Status:</span>
            <span className="text-white tracking-widest uppercase text-[10px]">Optimized</span>
          </div>
        </div>
        <button 
          onClick={onSyncNetwork}
          disabled={isAggregating}
          className={cn(
            "px-4 py-2 bg-zinc-900 text-white border border-zinc-600 text-xs font-bold uppercase tracking-widest rounded-none flex items-center gap-2 transition-all active:scale-95",
            isAggregating ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-800 hover:text-white shadow-sm hover:shadow-sm"
          )}
        >
          <RefreshCcw className={cn("w-4 h-4", isAggregating && "animate-spin")} />
          {isAggregating ? "Aggregating..." : "Push Global"}
        </button>
      </div>
    </header>
  );
}
