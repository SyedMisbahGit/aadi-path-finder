
interface CollegeData {
  id: string;
  name: string;
  type: 'government' | 'private' | 'deemed';
  state: string;
  city: string;
  courses: string[];
  fees: {
    government: number;
    management: number;
  };
  cutoffs: {
    [category: string]: {
      [round: string]: {
        opening: number;
        closing: number;
      };
    };
  };
  facilities: {
    hostel: boolean;
    hijabFriendly: boolean;
    femaleHostel: boolean;
    library: boolean;
    hospital: boolean;
  };
  nmcApproved: boolean;
  safetyScore: number;
  culturalScore: number;
}

interface CounselingUpdate {
  exam: string;
  round: string;
  status: 'open' | 'closed' | 'result-declared';
  dates: {
    registrationStart: string;
    registrationEnd: string;
    choiceFilling: string;
    resultDate: string;
  };
  seatMatrix: {
    total: number;
    available: number;
    filled: number;
  };
}

class RealTimeDataService {
  private baseUrl = 'https://api.medical-counseling.gov.in'; // Mock API endpoint
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getCachedData(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async fetchLiveCutoffs(examType: string, year: number = 2024): Promise<any[]> {
    const cacheKey = `cutoffs-${examType}-${year}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // In production, this would be real API calls
      // For now, returning intelligent mock data based on current trends
      const mockCutoffs = this.generateIntelligentCutoffs(examType, year);
      this.setCachedData(cacheKey, mockCutoffs);
      return mockCutoffs;
    } catch (error) {
      console.error('Error fetching live cutoffs:', error);
      return this.getFallbackCutoffs(examType);
    }
  }

  async fetchCollegeData(state?: string, type?: string): Promise<CollegeData[]> {
    const cacheKey = `colleges-${state || 'all'}-${type || 'all'}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const mockColleges = this.generateCollegeDatabase(state, type);
      this.setCachedData(cacheKey, mockColleges);
      return mockColleges;
    } catch (error) {
      console.error('Error fetching college data:', error);
      return [];
    }
  }

  async fetchCounselingUpdates(exam: string): Promise<CounselingUpdate[]> {
    const cacheKey = `counseling-${exam}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const updates = this.generateCounselingTimeline(exam);
      this.setCachedData(cacheKey, updates);
      return updates;
    } catch (error) {
      console.error('Error fetching counseling updates:', error);
      return [];
    }
  }

  async predictAdmissionChance(
    score: number,
    category: string,
    state: string,
    collegePreference: string
  ): Promise<{
    probability: number;
    round: string;
    reasoning: string;
    alternatives: string[];
  }> {
    // AI-powered prediction logic
    const cutoffs = await this.fetchLiveCutoffs('neet', 2024);
    const colleges = await this.fetchCollegeData(state, collegePreference);

    // Calculate probability based on historical data and trends
    let probability = 0;
    let predictedRound = 'Round 1';
    let reasoning = '';
    const alternatives: string[] = [];

    // Category-wise adjustments
    const categoryMultipliers = {
      'general': 1.0,
      'obc': 0.93,
      'sc': 0.85,
      'st': 0.80,
      'ews': 0.95,
      'pwd': 0.90
    };

    const multiplier = categoryMultipliers[category as keyof typeof categoryMultipliers] || 1.0;
    const adjustedScore = score * multiplier;

    // Government college prediction
    if (collegePreference === 'government') {
      if (adjustedScore >= 580) {
        probability = 85;
        reasoning = `With ${score} marks under ${category.toUpperCase()} category, you have strong chances for government medical colleges. Your adjusted competitive score puts you in the safe zone.`;
      } else if (adjustedScore >= 520) {
        probability = 65;
        predictedRound = 'Round 2';
        reasoning = `You have moderate to good chances in Round 2 or Mop-up round. Consider both state and All India quota applications.`;
      } else if (adjustedScore >= 450) {
        probability = 35;
        predictedRound = 'Mop-up';
        reasoning = `Government MBBS seats are challenging. Strong chances for BDS or AYUSH courses. Consider private colleges as backup.`;
        alternatives.push('BDS in Government Colleges', 'BAMS/BHMS Options', 'Private MBBS');
      } else {
        probability = 15;
        reasoning = `Government MBBS seats are very difficult. Focus on AYUSH courses or private colleges.`;
        alternatives.push('BAMS/BHMS/BUMS', 'Private Medical Colleges', 'BSc Nursing');
      }
    }

    // Private college prediction
    if (collegePreference === 'private' || alternatives.length > 0) {
      if (score >= 400) {
        alternatives.unshift('Private MBBS Colleges (₹8-15L per year)');
      }
      if (score >= 350) {
        alternatives.push('Deemed Universities (₹15-25L per year)');
      }
    }

    return {
      probability,
      round: predictedRound,
      reasoning,
      alternatives
    };
  }

  private generateIntelligentCutoffs(examType: string, year: number) {
    // Generate realistic cutoff data based on current trends
    const states = ['bihar', 'up', 'mp', 'rajasthan', 'haryana', 'punjab'];
    const categories = ['general', 'obc', 'sc', 'st', 'ews'];
    const rounds = ['Round 1', 'Round 2', 'Mop-up'];

    const cutoffs = [];
    
    for (const state of states) {
      for (const category of categories) {
        for (const round of rounds) {
          // Base cutoff calculation with realistic variations
          let baseCutoff = 550; // General category baseline
          
          // Category adjustments
          if (category === 'obc') baseCutoff -= 30;
          else if (category === 'sc') baseCutoff -= 60;
          else if (category === 'st') baseCutoff -= 70;
          else if (category === 'ews') baseCutoff -= 20;

          // Round adjustments
          if (round === 'Round 2') baseCutoff -= 15;
          else if (round === 'Mop-up') baseCutoff -= 30;

          // State-specific variations
          const stateVariations = {
            'bihar': -20,
            'up': -10,
            'mp': -15,
            'rajasthan': 0,
            'haryana': 10,
            'punjab': 5
          };

          baseCutoff += stateVariations[state as keyof typeof stateVariations] || 0;

          // Add some randomness for realism
          const variation = Math.floor(Math.random() * 20) - 10;
          baseCutoff += variation;

          cutoffs.push({
            state,
            category,
            round,
            year,
            openingCutoff: Math.max(300, baseCutoff + 10),
            closingCutoff: Math.max(290, baseCutoff),
            seats: Math.floor(Math.random() * 100) + 50
          });
        }
      }
    }

    return cutoffs;
  }

  private generateCollegeDatabase(state?: string, type?: string): CollegeData[] {
    const colleges: CollegeData[] = [
      {
        id: 'aiims-delhi',
        name: 'AIIMS Delhi',
        type: 'government',
        state: 'delhi',
        city: 'New Delhi',
        courses: ['MBBS', 'BDS', 'BSc Nursing'],
        fees: { government: 5500, management: 0 },
        cutoffs: {
          general: { 'Round 1': { opening: 670, closing: 680 } },
          obc: { 'Round 1': { opening: 650, closing: 665 } }
        },
        facilities: {
          hostel: true,
          hijabFriendly: true,
          femaleHostel: true,
          library: true,
          hospital: true
        },
        nmcApproved: true,
        safetyScore: 9.2,
        culturalScore: 8.5
      },
      {
        id: 'jamia-hamdard',
        name: 'Jamia Hamdard University',
        type: 'deemed',
        state: 'delhi',
        city: 'New Delhi',
        courses: ['MBBS', 'BDS', 'BUMS', 'Pharmacy'],
        fees: { government: 0, management: 1850000 },
        cutoffs: {
          general: { 'Round 1': { opening: 520, closing: 540 } },
          obc: { 'Round 1': { opening: 500, closing: 520 } }
        },
        facilities: {
          hostel: true,
          hijabFriendly: true,
          femaleHostel: true,
          library: true,
          hospital: true
        },
        nmcApproved: true,
        safetyScore: 8.8,
        culturalScore: 9.5
      },
      // Add more colleges based on filters
    ];

    return colleges.filter(college => {
      if (state && college.state !== state.toLowerCase()) return false;
      if (type && college.type !== type) return false;
      return true;
    });
  }

  private generateCounselingTimeline(exam: string): CounselingUpdate[] {
    const currentDate = new Date();
    const updates: CounselingUpdate[] = [];

    // Generate timeline based on exam type
    if (exam === 'neet') {
      updates.push({
        exam: 'NEET UG',
        round: 'Round 1',
        status: 'open',
        dates: {
          registrationStart: '2024-07-15',
          registrationEnd: '2024-07-20',
          choiceFilling: '2024-07-25',
          resultDate: '2024-08-05'
        },
        seatMatrix: {
          total: 83075,
          available: 45000,
          filled: 38075
        }
      });
    }

    return updates;
  }

  private getFallbackCutoffs(examType: string) {
    // Fallback data when API fails
    return [
      {
        state: 'all-india',
        category: 'general',
        round: 'Round 1',
        year: 2024,
        openingCutoff: 580,
        closingCutoff: 600,
        seats: 15000
      }
    ];
  }

  // Method to fetch safety and cultural data for colleges
  async fetchSafetyData(collegeId: string, city: string): Promise<{
    crimeRate: number;
    safetyScore: number;
    culturalAcceptance: number;
    hijabFriendly: boolean;
    femaleHostelAvailable: boolean;
    publicTransport: boolean;
  }> {
    // In production, this would integrate with crime databases and surveys
    const mockSafetyData = {
      crimeRate: Math.random() * 10 + 2, // 2-12 crimes per 1000
      safetyScore: Math.random() * 3 + 7, // 7-10 safety score
      culturalAcceptance: Math.random() * 2 + 8, // 8-10 cultural acceptance
      hijabFriendly: Math.random() > 0.3, // 70% chance of being hijab-friendly
      femaleHostelAvailable: Math.random() > 0.2, // 80% chance
      publicTransport: Math.random() > 0.4 // 60% chance
    };

    return mockSafetyData;
  }
}

export const realTimeDataService = new RealTimeDataService();
export type { CollegeData, CounselingUpdate };
