// ─── Core Data Interfaces ────────────────────────────────────────────────────

export type AppMode = 'industry' | 'consumer';

export interface Standard {
  id: string;
  number: string;
  title: string;
  status: 'active' | 'draft' | 'withdrawn' | 'amended';
  sector: string;
  category: string;
  mandatory: boolean;
  applicability: string;
  lastUpdated: string; // ISO date
  scope: string;
  keyRequirements: string[];
  testingRequirements: string[];
  documentation: string[];
  relatedStandardIds: string[];
  amendments: { date: string; summary: string }[];
}

export interface ComplianceStage {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'complete';
  requiredDocuments: string[];
  complexity: 'low' | 'medium' | 'high';
  responsibleParty: string;
  relatedServiceId: string;
  description: string;
  estimatedDays: number;
}

export interface AssistantAnswer {
  id: string;
  query: string;
  answerText: string;
  reasoning: string;
  matchedStandards: { standardId: string; confidence: 'high' | 'possible' }[];
  nextSteps: {
    label: string;
    actionType: 'save' | 'checklist' | 'upload' | 'service' | 'reminder';
    payload?: string;
  }[];
}

export interface BISService {
  id: string;
  name: string;
  category: 'certification' | 'registration' | 'testing' | 'licensing' | 'laboratory' | 'consumer' | 'complaints' | 'standards';
  description: string;
  targetAudience: string;
  requiredDocuments: string[];
  processOverview: string;
  stepCount: number;
  relatedStandardIds: string[];
}

export interface ConsumerAlert {
  id: string;
  type: 'recall' | 'notice' | 'safety' | 'update';
  title: string;
  product: string;
  issuer: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  summary: string;
  actionRequired: string;
}

export interface SavedItem {
  id: string;
  type: 'standard' | 'service' | 'checklist-item';
  referenceId: string;
  label: string;
  savedAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  standardId?: string;
  stageId?: string;
}

export interface DemoScenario {
  productName: string;
  businessType: string;
  location: string;
  standardId: string;
  stages: string[];
  gaps: string[];
  testingRequirements: string[];
  recommendedServices: string[];
  actionPlan: string[];
}
