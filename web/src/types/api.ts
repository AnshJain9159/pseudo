export interface AnalyzeRequest {
  code: string;
  language: 'javascript' | 'python' | 'cpp';
}

export interface Analysis {
  timeComplexity: string;
  spaceComplexity: string;
  loopNestDepth: number;
  recursion: boolean;
  dataStructures: Set<string>;
}

export interface AnalyzeResponse {
  analysis?: Analysis;
  feedback?: string[];
  error?: string;
} 