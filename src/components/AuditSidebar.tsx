/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { History } from 'lucide-react';
import { AuditLog, cn } from '../lib/utils';

interface AuditSidebarProps {
  logs: AuditLog[];
}

export default function AuditSidebar({ logs }: AuditSidebarProps) {
  return (
    <aside id="auditing" className="col-span-12 lg:col-span-4 flex flex-col gap-8 h-full">
      <div className="bg-zinc-950 text-white border border-zinc-700 rounded-none p-4 flex flex-col flex-1 overflow-hidden min-h-[300px]">
        <div className="flex items-center gap-2 mb-4 border-b border-zinc-700 pb-3">
          <History className="w-4 h-4 text-white" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white">Auditing & Reports</h3>
        </div>
        <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-3 pr-2 scrollbar-hide">
          {logs.map((log) => (
            <div key={log.id} className="border-l border-zinc-800 pl-3 py-1 hover:border-zinc-600 transition-colors group">
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "font-bold uppercase tracking-widest text-[9px]",
                  log.type === 'aggregation' ? "text-white" : log.type === 'local_update' ? "text-white" : "text-white"
                )}>[{log.event}]</span>
                <span className="text-zinc-600">@ {log.timestamp}</span>
              </div>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">{log.details}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
