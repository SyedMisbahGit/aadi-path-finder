
export interface JEEProfile {
  id?: string;
  name?: string;
  jeePercentile: number;
  jeeRank?: number;
  category: 'general' | 'obc' | 'sc' | 'st' | 'ews';
  state: string;
  gender: 'male' | 'female' | 'other';
  preferredBranches: string[];
  budget: 'government' | 'private' | 'any';
  preferences: {
    location?: string[];
    collegeType?: ('nit' | 'iiit' | 'gfti')[];
    placementPriority?: number; // 1-10 scale
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface JEECollege {
  id: string;
  name: string;
  location: string;
  state: string;
  type: 'nit' | 'iiit' | 'gfti' | 'private';
  branches: string[];
  fees: { min: number; max: number };
  placementData: {
    averagePackage: number;
    highestPackage: number;
    placementRate: number;
  };
  ranking: number;
  aicteApproved: boolean;
  establishedYear?: number;
}

export interface JEECutoff {
  collegeId: string;
  branch: string;
  category: string;
  round: number;
  openingRank: number;
  closingRank: number;
  year: number;
}

export interface JEERecommendation {
  college: JEECollege;
  branch: string;
  admissionProbability: number;
  cutoffPrediction: number;
  placementScore: number;
  aiReasoning: string;
  benefits: string[];
  riskFactors: string[];
  estimatedCost: number;
}
