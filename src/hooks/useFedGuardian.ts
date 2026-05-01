/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Bank,
  FraudRule,
  INITIAL_BANKS,
  AuditLog,
  CounterfactualExplanation,
} from '../lib/utils';
import { aggregateGlobalRules, generateCounterfactual } from '../services/geminiService';

export function useFedGuardian() {
  const [banks, setBanks] = useState<Bank[]>(() => {
    const saved = localStorage.getItem('fedguardian_banks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved banks:", e);
      }
    }
    return INITIAL_BANKS;
  });

  useEffect(() => {
    localStorage.setItem('fedguardian_banks', JSON.stringify(banks));
  }, [banks]);

  const [globalRules, setGlobalRules] = useState<FraudRule[]>([]);
  const [isAggregating, setIsAggregating] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [explanation, setExplanation] = useState<CounterfactualExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [viewingBankId, setViewingBankId] = useState<string | null>(null);

  const currentViewingBank = banks.find(b => b.id === viewingBankId) || null;

  const addLog = (event: string, details: string, type: AuditLog['type']) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      event,
      details,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const syncNetwork = async (triggeringBankId?: string) => {
    setIsAggregating(true);
    addLog("Network Sync Triggered", triggeringBankId ? `Initiated by ${banks.find(b => b.id === triggeringBankId)?.name}` : "System scheduled sync", "aggregation");

    try {
      const newGlobalRules = await aggregateGlobalRules(banks);
      setGlobalRules(newGlobalRules);
      
      // Artificial delay to show processing
      await new Promise(r => setTimeout(r, 1500));

      const updatedBanks = banks.map(b => ({
        ...b,
        performanceScore: Math.min(98, b.performanceScore + (Math.random() * 3)),
        fraudRate: Math.max(0.1, b.fraudRate - (Math.random() * 0.2)),
        lastUpdate: new Date().toISOString(),
        rules: newGlobalRules.map(r => ({ ...r }))
      }));
      
      setBanks(updatedBanks);
      addLog("Global Consistency Achieved", "All nodes updated with consolidated logic", "aggregation");
    } finally {
      setIsAggregating(false);
    }
  };

  const handleUpdateRule = (bankId: string, ruleId: string, updates: Partial<FraudRule>) => {
    setBanks(prev => prev.map(b => {
      if (b.id !== bankId) return b;
      return {
        ...b,
        rules: b.rules.map(r => r.id === ruleId ? { ...r, ...updates } : r)
      };
    }));
  };

  const saveAndSync = (bankId: string) => {
    const sourceBank = banks.find(b => b.id === bankId);
    if (!sourceBank) return;

    addLog("Manual Core Update", `Propagating authoritative logic from ${sourceBank.name} to network`, "local_update");
    
    // Propagate these rules to all banks
    setBanks(prev => prev.map(bank => ({
      ...bank,
      rules: sourceBank.rules.map(r => ({ ...r })),
      performanceScore: Math.min(99, bank.performanceScore + 1),
      lastUpdate: new Date().toISOString()
    })));

    setGlobalRules(sourceBank.rules.map(r => ({ ...r })));
    setViewingBankId(null);
    
    // We intentionally do NOT trigger an immediate AI sync here, 
    // as it would overwrite the user's manual edits with AI-generated defaults.
    // The user can still push a global AI update via the "Push Global Update" button.
  };

  const explainUpdate = async (bank: Bank) => {
    setIsExplaining(true);
    setSelectedBank(bank);
    setViewingBankId(null);
    try {
      const exp = await generateCounterfactual(bank.rules, globalRules, bank.name, bank.transactions);
      setExplanation(exp);
    } catch (e) {
      addLog("XAI Error", `Could not generate explanation for ${bank.name}`, "system");
    } finally {
      setIsExplaining(false);
    }
  };

  return {
    banks,
    globalRules,
    isAggregating,
    logs,
    selectedBank,
    setSelectedBank,
    explanation,
    isExplaining,
    viewingBankId,
    setViewingBankId,
    currentViewingBank,
    syncNetwork,
    handleUpdateRule,
    saveAndSync,
    explainUpdate,
  };
}
