/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  threshold: number;
  weight: number;
  category: 'behavior' | 'velocity' | 'location' | 'amount';
  isActive: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  location: string;
  timestamp: string;
  isFraud: boolean;
  type: 'withdrawal' | 'transfer' | 'purchase';
  merchant: string;
}

export interface Bank {
  id: string;
  name: string;
  localDataCount: number;
  fraudRate: number;
  performanceScore: number;
  rules: FraudRule[];
  color: string;
  lastUpdate: string;
  transactions: Transaction[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  type: 'system' | 'aggregation' | 'local_update';
}

export interface CounterfactualExplanation {
  originalDecision: string;
  counterfactualScenario: string;
  requiredChanges: string[];
  impactDescription: string;
}

const generateMockTransactions = (count: number, fraudProbability: number): Transaction[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `tx-${Math.random().toString(36).substr(2, 5)}`,
    amount: Math.floor(Math.random() * 10000) + 10,
    location: ['New York', 'London', 'Tokyo', 'Berlin', 'Mumbai'][Math.floor(Math.random() * 5)],
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    isFraud: Math.random() < fraudProbability,
    type: ['withdrawal', 'transfer', 'purchase'][Math.floor(Math.random() * 3)] as any,
    merchant: ['Amazon', 'Uber', 'Shell', 'Apple', 'CryptoEx'][Math.floor(Math.random() * 5)],
  }));
};

export const INITIAL_BANKS: Bank[] = [
  {
    id: 'bank-a',
    name: 'NeoBank Apex',
    localDataCount: 15400,
    fraudRate: 1.2,
    performanceScore: 92,
    color: '#3b82f6',
    lastUpdate: new Date().toISOString(),
    transactions: generateMockTransactions(15, 0.05),
    rules: [
      { id: 'v1', name: 'Rapid Fire', description: 'Detects 3+ transactions in 10s', threshold: 3, weight: 0.8, category: 'velocity', isActive: true },
      { id: 'v2', name: 'Geo-Leap', description: 'Detects distance > 500km in < 1h', threshold: 500, weight: 0.9, category: 'location', isActive: true },
    ]
  },
  {
    id: 'bank-b',
    name: 'TrustFirst Group',
    localDataCount: 42000,
    fraudRate: 2.8,
    performanceScore: 78,
    color: '#ef4444',
    lastUpdate: new Date().toISOString(),
    transactions: generateMockTransactions(15, 0.12),
    rules: [
      { id: 'v1', name: 'Daily Limit', description: 'Flag transactions over $5000', threshold: 5000, weight: 0.5, category: 'amount', isActive: true },
    ]
  },
  {
    id: 'bank-c',
    name: 'Quantum Credit',
    localDataCount: 8900,
    fraudRate: 0.5,
    performanceScore: 88,
    color: '#10b981',
    lastUpdate: new Date().toISOString(),
    transactions: generateMockTransactions(15, 0.02),
    rules: [
      { id: 'v3', name: 'Anomaly Check', description: 'Off-hours high value purchases', threshold: 0.7, weight: 0.75, category: 'behavior', isActive: true },
    ]
  },
];
