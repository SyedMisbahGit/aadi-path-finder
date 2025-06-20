
interface LiveData {
  cutoffs: any;
  seatMatrix: any;
  counselingSchedule: any;
  lastUpdated: string;
}

class RealTimeDataService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getLiveCutoffs(examType: string, year: string = '2024') {
    const cacheKey = `cutoffs-${examType}-${year}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchCutoffData(examType, year);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Live cutoff fetch failed:', error);
      return this.getFallbackCutoffs(examType);
    }
  }

  async getSeatMatrix(examType: string, state?: string, category?: string) {
    const cacheKey = `seats-${examType}-${state || 'all'}-${category || 'all'}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchSeatMatrix(examType, state, category);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Seat matrix fetch failed:', error);
      return this.getFallbackSeatMatrix(examType);
    }
  }

  async getCounselingSchedule(examType: string) {
    const cacheKey = `schedule-${examType}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchCounselingSchedule(examType);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Schedule fetch failed:', error);
      return this.getFallbackSchedule(examType);
    }
  }

  private async fetchCutoffData(examType: string, year: string) {
    // Simulate API calls to MCC/JoSAA
    const response = await fetch(`/api/cutoffs/${examType}/${year}`);
    if (!response.ok) throw new Error('Cutoff API failed');
    return await response.json();
  }

  private async fetchSeatMatrix(examType: string, state?: string, category?: string) {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (category) params.append('category', category);
    
    const response = await fetch(`/api/seats/${examType}?${params}`);
    if (!response.ok) throw new Error('Seat matrix API failed');
    return await response.json();
  }

  private async fetchCounselingSchedule(examType: string) {
    const response = await fetch(`/api/schedule/${examType}`);
    if (!response.ok) throw new Error('Schedule API failed');
    return await response.json();
  }

  private getFromCache(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getFallbackCutoffs(examType: string) {
    return {
      government: { general: 550, obc: 500, sc: 450, st: 450 },
      private: { general: 450, obc: 400, sc: 350, st: 350 },
      lastUpdated: new Date().toISOString(),
      source: 'cached_data'
    };
  }

  private getFallbackSeatMatrix(examType: string) {
    return {
      totalSeats: 50000,
      governmentSeats: 25000,
      privateSeats: 20000,
      deemedSeats: 5000,
      byCategory: {
        general: 0.5,
        obc: 0.27,
        sc: 0.15,
        st: 0.075
      },
      lastUpdated: new Date().toISOString()
    };
  }

  private getFallbackSchedule(examType: string) {
    return {
      rounds: [
        { name: 'Round 1', startDate: '2024-07-15', endDate: '2024-07-25' },
        { name: 'Round 2', startDate: '2024-08-01', endDate: '2024-08-10' },
        { name: 'Mop-up', startDate: '2024-08-20', endDate: '2024-08-30' }
      ],
      currentRound: 'Round 1',
      lastUpdated: new Date().toISOString()
    };
  }
}

export const realTimeDataService = new RealTimeDataService();
