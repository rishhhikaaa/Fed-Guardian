/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence } from 'motion/react';
import { useFedGuardian } from './hooks/useFedGuardian';
import Header from './components/Header';
import NetworkTopology from './components/NetworkTopology';
import AuditSidebar from './components/AuditSidebar';
import BankCard from './components/BankCard';
import BankManagementModal from './components/BankManagementModal';
import XAIInsightsModal from './components/XAIInsightsModal';

export default function App() {
  const {
    banks,
    isAggregating,
    logs,
    selectedBank,
    setSelectedBank,
    explanation,
    isExplaining,
    setViewingBankId,
    currentViewingBank,
    syncNetwork,
    handleUpdateRule,
    saveAndSync,
    explainUpdate,
  } = useFedGuardian();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono selection:bg-zinc-800 selection:text-white">
      <Header 
        isAggregating={isAggregating} 
        onSyncNetwork={() => syncNetwork()} 
      />

      <main className="p-8 max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
        <NetworkTopology 
          banks={banks} 
          isAggregating={isAggregating} 
          onSelectBank={(id) => setViewingBankId(id)} 
        />

        <AuditSidebar logs={logs} />

        <section id="bank-clusters" className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banks.map((bank) => (
            <BankCard
              key={bank.id}
              bank={bank}
              onViewBank={(id) => setViewingBankId(id)}
              onExplainUpdate={explainUpdate}
            />
          ))}
        </section>
      </main>

      {/* Bank Management Modal */}
      <AnimatePresence>
        {currentViewingBank && (
          <BankManagementModal
            bank={currentViewingBank}
            onClose={() => setViewingBankId(null)}
            onUpdateRule={handleUpdateRule}
            onSaveAndSync={saveAndSync}
            onExplainUpdate={explainUpdate}
          />
        )}
      </AnimatePresence>

      {/* XAI Explanation Overlay */}
      <AnimatePresence>
        {selectedBank && (
          <XAIInsightsModal
            selectedBank={selectedBank}
            explanation={explanation}
            isExplaining={isExplaining}
            onClose={() => setSelectedBank(null)}
          />
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-grid {
          background-image: 
            linear-gradient(to right, #f0f0f0 1px, transparent 1px),
            linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
