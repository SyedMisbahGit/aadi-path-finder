
export interface NEETProfile {
  id?: string;
  name?: string;
  neetScore: number;
  neetRank?: number;
  category: 'general' | 'obc' | 'sc' | 'st' | 'ews';
  state: string;
  domicile: boolean;
  gender: 'male' | 'female' | 'other';
  budget: 'government' | 'private' | 'any';
  preferences: {
    hostel?: boolean;
    hijabFriendly?: boolean;
    femaleOnly?: boolean;
    location?: string[];
    courseType?: ('mbbs' | 'bds' | 'ayush')[];
  };
  safetyPriority?: number; // 1-10 scale
  createdAt?: string;
  updatedAt?: string;
}

export interface NEETCollege {
  id: string;
  name: string;
  location: string;
  state: string;
  type: 'government' | 'private' | 'deemed';
  courses: string[];
  fees: { min: number; max: number };
  hostelAvailable: boolean;
  hijabFriendly?: boolean;
  femaleOnlyHostel?: boolean;
  safetyScore: number;
  culturalFitScore: number;
  nmcApproved: boolean;
  establishedYear?: number;
  ranking?: number;
}

export interface NEETCutoff {
  collegeId: string;
  category: string;
  round: number;
  openingRank: number;
  closingRank: number;
  year: number;
}

export interface NEETRecommendation {
  college: NEETCollege;
  admissionProbability: number;
  safetyRating: number;
  culturalFit: number;
  cutoffPrediction: number;
  aiReasoning: string;
  benefits: string[];
  riskFactors: string[];
  estimatedCost: number;
}
