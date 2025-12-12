
// Define workflow-based tab structure with dynamic agent categorization
export const WORKFLOW_TABS = {
  quickstart: {
    id: 'quickstart',
    label: 'Quick Start',
    description: 'Most commonly customized settings',
    patterns: ['template', 'blueprint', 'conversational']
  },
  planning: {
    id: 'planning',
    label: 'Planning',
    description: 'Project planning and setup',
    patterns: ['phase', 'project', 'suggestion', 'generation']
  },
  coding: {
    id: 'coding',
    label: 'Coding',
    description: 'Development and implementation',
    patterns: ['implementation', 'file', 'regeneration']
  },
  debugging: {
    id: 'debugging',
    label: 'Debugging',
    description: 'Code fixing and review',
    patterns: ['fixer', 'fix', 'review', 'debug']
  },
} as const;

// Helper function to categorize agents dynamically with specific mappings
export const categorizeAgent = (agentKey: string): string => {
  // Specific agent mappings first (highest priority)
  const specificMappings: Record<string, string> = {
    // Quick Start - Most commonly used
    'templateSelection': 'quickstart',
    'conversationalResponse': 'quickstart',

    // Planning - Project planning and setup
    'phaseGeneration': 'planning',
    'blueprint': 'quickstart',
    'projectSetup': 'planning',

    // Coding - Development and implementation
    'phaseImplementation': 'coding',        // Fix: was going to planning due to "phase"
    'firstPhaseImplementation': 'coding',   // Fix: was going to planning due to "phase"
    'fileRegeneration': 'coding',           // Fix: was going to planning due to "generation"

    // Debugging - Code fixing and review
    'deepDebugger': 'debugging',
  };

  // Check specific mappings first
  if (specificMappings[agentKey]) {
    return specificMappings[agentKey];
  }

  // Fallback to pattern matching for unknown agents (future-proofing)
  const key = agentKey.toLowerCase();

  // More targeted pattern matching to avoid conflicts
  if (key.includes('template') || key.includes('selection')) return 'quickstart';
  if (key.includes('blueprint') || key.includes('architect')) return 'quickstart';
  if (key.includes('conversation') || key.includes('chat') || key.includes('response')) return 'quickstart';

  if (key.includes('project') && key.includes('setup')) return 'planning';
  if (key.includes('suggestion') && key.includes('process')) return 'planning';
  if (key.includes('planning') || key.includes('plan')) return 'planning';

  if (key.includes('implementation') || key.includes('implement')) return 'coding';
  if (key.includes('regenerat') || key.includes('regen')) return 'coding';
  if (key.includes('code') && key.includes('gen')) return 'coding';

  if (key.includes('fixer') || key.includes('fix')) return 'debugging';
  if (key.includes('debug') || key.includes('review')) return 'debugging';
  if (key.includes('lint') || key.includes('check')) return 'debugging';

  if (key.includes('screenshot') || key.includes('image') || key.includes('vision')) return 'advanced';
  if (key.includes('analysis') || key.includes('analyz')) return 'advanced';

  // Default to advanced for completely unknown agents
  return 'advanced';
};