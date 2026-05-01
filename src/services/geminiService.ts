/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Bank, FraudRule, CounterfactualExplanation } from "../lib/utils";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function aggregateGlobalRules(banks: Bank[]): Promise<FraudRule[]> {
  const prompt = `
    You are a Federated Learning Aggregator for a Global Fraud Prevention Network.
    You have local model rules from multiple banks:
    ${banks.map(b => `- ${b.name}: Performance ${b.performanceScore}%, Fraud Rate ${b.fraudRate}%, Rules: ${JSON.stringify(b.rules)}`).join('\n')}

    Your task:
    1. Merge and consolidate these local rules into a single "Global Master Set".
    2. CRITICAL: Do NOT invent new random default thresholds. You MUST respect the user-modified thresholds in the provided data. If multiple banks have rules with the same name, combine them and average their 'threshold' and 'weight' values algebraically.
    3. The final synthesized rules must accurately reflect the mathematical blend of the local banks' inputs to preserve manual edits.
    4. Ensure the output strictly follows the required format.

    Return the result as a JSON array of FraudRule objects matching the format of the input rules.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              threshold: { type: Type.NUMBER },
              weight: { type: Type.NUMBER },
              category: { type: Type.STRING, enum: ['behavior', 'velocity', 'location', 'amount'] },
              isActive: { type: Type.BOOLEAN }
            },
            required: ['name', 'description', 'threshold', 'weight', 'category', 'isActive']
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text).map((r: any, idx: number) => ({ ...r, id: `global-${idx}` }));
  } catch (error) {
    console.error("Aggregation failed:", error);
    // Return performance-based fallback (highest performing bank's rules) deep copied
    const bestBank = [...banks].sort((a, b) => b.performanceScore - a.performanceScore)[0];
    return bestBank.rules.map(r => ({ ...r }));
  }
}

export async function generateCounterfactual(
  originalRules: FraudRule[],
  newRules: FraudRule[],
  bankName: string,
  transactions: any[]
): Promise<CounterfactualExplanation> {
  const transactionSummary = transactions.map(t => 
    `${t.isFraud ? "[FRAUD]" : "[CLEAN]"} ${t.type} of $${t.amount} at ${t.merchant} (${t.location})`
  ).join('\n');

  const prompt = `
    Bank: ${bankName}
    Current Rules: ${JSON.stringify(originalRules)}
    New Proposed Rules: ${JSON.stringify(newRules)}

    Historical Transaction Data subset:
    ${transactionSummary}

    As an Explainable AI (XAI) using DiCE (Diverse Counterfactual Explanations) concepts, explain why the update is necessary based on PHYSICAL transaction patterns seen above.
    
    Specifically:
    1. "originalDecision": How the old rules handled these transactions (especially the missed ones or false positives).
    2. "counterfactualScenario": "If we had applied the NEW rules to this specific set of ${transactions.length} transactions, X would have happened instead of Y."
    3. "requiredChanges": Explicit changes to thresholds or logic.
    4. "impactDescription": Estimated reduction in fraud or false positives.

    Return a JSON object with keys: originalDecision, counterfactualScenario, requiredChanges (array of strings), impactDescription.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalDecision: { type: Type.STRING },
            counterfactualScenario: { type: Type.STRING },
            requiredChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
            impactDescription: { type: Type.STRING }
          },
          required: ['originalDecision', 'counterfactualScenario', 'requiredChanges', 'impactDescription']
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Counterfactual generation failed:", error);
    return {
      originalDecision: "Local rule set applied.",
      counterfactualScenario: "Comparison with global model failed.",
      requiredChanges: ["Review global norms manually."],
      impactDescription: "Unable to calculate automated impact."
    };
  }
}
