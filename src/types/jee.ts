
export interface JEEProfile {
  name?: string;
  jeePercentile: number;
  category: 'general' | 'obc' | 'sc' | 'st' | 'ews';
  state: string;
  gender: 'male' | 'female' | 'other';
  preferredBranches: string[];
  budget: 'government' | 'private' | 'any';
  preferences: {
    location: string[];
    collegeType: string[];
    placementPriority: number;
  };
}

export interface JEECollege {
  id: string;
  name: string;
  location: string;
  state: string;
  type: 'nit' | 'iiit' | 'gfti' | 'private';
  branches: string[];
  fees: {
    min: number;
    max: number;
  };
  placementData: {
    averagePackage: number;
    highestPackage: number;
    placementRate: number;
  };
  ranking: number;
  aicteApproved: boolean;
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

export interface JEESeatInfo {
  college: string;
  branch: string;
  category: string;
  totalSeats: number;
  availableSeats: number;
  cutoffRank: number;
}
