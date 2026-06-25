import { classifyIncident } from './classifier.js';
import { getImmediateActions } from './actionEngine.js';
import { getRelevantLaws } from './lawMappingEngine.js';
import { getEvidenceChecklist } from './evidenceEngine.js';
import { getReportingGuidance } from './reportingEngine.js';

export async function processIntelligence(redactedSummary, recentMessagesText) {
  // 1. Run the LLM Classifier
  const classification = await classifyIncident(redactedSummary, recentMessagesText);
  
  if (!classification || !classification.category || classification.confidence < 70) {
    // Return a low-confidence flag so the frontend knows not to open the panel yet
    return {
      classified: false,
      confidence: classification?.confidence || 0,
      reason: 'Insufficient information to confidently classify the incident.'
    };
  }

  const category = classification.category;

  // 2. Attach Deterministic Domain Data
  const intelligencePayload = {
    classified: true,
    category: category,
    severity: classification.severity || 'Unknown',
    risk: classification.risk || 'Unknown',
    status: classification.status || 'Open',
    confidence: classification.confidence,
    immediateActions: getImmediateActions(category),
    evidenceChecklist: getEvidenceChecklist(category),
    reportingGuidance: getReportingGuidance(category),
    relevantLaws: getRelevantLaws(category),
    timestamp: new Date().toISOString()
  };

  return intelligencePayload;
}
