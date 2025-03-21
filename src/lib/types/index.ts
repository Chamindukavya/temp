// Re-export all types from various type files

// Basic quiz types
export * from './Quiz';

// MongoDB document types for SJT papers
export * from './SJTPaper';

// API request/response types
export * from './ApiTypes';

// User progress and attempt types
export * from './UserProgress';

// Export a type utility for Partial with nested properties
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T; 