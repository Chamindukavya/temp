import { SJTPaperWithId, SJTPaperListResponse, SJTPaperResponse } from "./SJTPaper";

// Common API response structure
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination params for list endpoints
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Filter params for SJT papers
export interface SJTPaperFilterParams extends PaginationParams {
  subject?: string;
  search?: string;
}

// API response for SJT paper list
export type SJTPaperListApiResponse = ApiResponse<SJTPaperListResponse>;

// API response for a single SJT paper
export type SJTPaperApiResponse = ApiResponse<SJTPaperResponse>;

// Create SJT paper request
export interface CreateSJTPaperRequest {
  title: string;
  paperDescription: string;
  subject: string;
  timeLimit: number;
  questions: Array<{
    question: string;
    type: "ranking" | "best_choice";
    answer: string;
    description?: string;
    choices: string[];
  }>;
}

// Update SJT paper request
export interface UpdateSJTPaperRequest {
  title?: string;
  paperDescription?: string;
  subject?: string;
  timeLimit?: number;
  questions?: Array<{
    question: string;
    type: "ranking" | "best_choice";
    answer: string;
    description?: string;
    choices: string[];
  }>;
} 