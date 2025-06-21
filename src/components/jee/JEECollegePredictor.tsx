
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, School, TrendingUp, MapPin } from 'lucide-react';
import type { JEEProfile, JEERecommendation } from '@/types/jee';

interface JEECollegePredictorProps {
  profile: JEEProfile | null;
  language: 'en' | 'hi' | 'ur';
}

export const JEECollegePredictor = ({ profile, language }: JEECollegePredictorProps) => {
  const [predictions, setPredictions] = useState<JEERecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      generatePredictions();
    }
  }, [profile]);

  const generatePredictions = async () => {
    if (!profile) return;
    
    setLoading(true);
    
    // Mock predictions based on profile
    const mockPredictions: JEERecommendation[] = [
      {
        college: {
          id: '1',
          name: 'NIT Warangal',
          location: 'Warangal',
          state: 'Telangana',
          type: 'nit',
          branches: ['Computer Science', 'Electronics'],
          fees: { min: 150000, max: 200000 },
          placementData: {
            averagePackage: 1200000,
            highestPackage: 4500000,
            placementRate: 95
          },
          ranking: 15,
          aicteApproved: true
        },
        branch: 'Computer Science Engineering',
        admissionProbability: 85,
        cutoffPrediction: profile.jeePercentile + 2,
        placementScore: 9.2,
        aiReasoning: 'Strong match based on your percentile and preferences',
        benefits: ['Excellent placement record', 'Strong alumni network', 'Good infrastructure'],
        riskFactors: ['High competition', 'Limited seats'],
        estimatedCost: 600000
      },
      {
        college: {
          id: '2',
          name: 'IIIT Hyderabad',
          location: 'Hyderabad',
          state: 'Telangana',
          type: 'iiit',
          branches: ['Computer Science', 'Electronics'],
          fees: { min: 200000, max: 300000 },
          placementData: {
            averagePackage: 1800000,
            highestPackage: 6000000,
            placementRate: 98
          },
          ranking: 8,
          aicteApproved: true
        },
        branch: 'Computer Science Engineering',
        admissionProbability: 65,
        cutoffPrediction: profile.jeePercentile + 5,
        placementScore: 9.8,
        aiReasoning: 'Premium institute with excellent CS program',
        benefits: ['Top-tier placement', 'Research opportunities', 'Industry connections'],
        riskFactors: ['Very high cutoff', 'Expensive'],
        estimatedCost: 1200000
      }
    ];

    setTimeout(() => {
      setPredictions(mockPredictions);
      setLoading(false);
    }, 1500);
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === 'en' ? 'Please complete your profile first to get college predictions' :
             language === 'hi' ? 'कॉलेज भविष्यवाणी के लिए पहले अपनी प्रोफ़ाइल पूरी करें' :
             'کالج کی پیش گوئی کے لیے پہلے اپنا پروفائل مکمل کریں'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="w-5 h-5" />
            {language === 'en' ? 'College Predictions' :
             language === 'hi' ? 'कॉलेज भविष्यवाणियां' :
             'کالج کی پیش گوئیاں'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="font-bold text-2xl text-blue-600">{profile.jeePercentile}%</div>
              <div className="text-sm text-gray-600">Your Percentile</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="font-bold text-2xl text-green-600">{predictions.length}</div>
              <div className="text-sm text-gray-600">Matches Found</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="font-bold text-2xl text-purple-600">{profile.category.toUpperCase()}</div>
              <div className="text-sm text-gray-600">Category</div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Analyzing your profile...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{prediction.college.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{prediction.college.location}, {prediction.college.state}</span>
                          <Badge variant="outline">{prediction.college.type.toUpperCase()}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{prediction.admissionProbability}%</div>
                        <div className="text-sm text-gray-500">Admission Chance</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="font-semibold text-blue-600">{prediction.branch}</p>
                      <p className="text-sm text-gray-600 mt-1">{prediction.aiReasoning}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Benefits</h4>
                        <ul className="text-sm space-y-1">
                          {prediction.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2">Risk Factors</h4>
                        <ul className="text-sm space-y-1">
                          {prediction.riskFactors.map((risk, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span>Avg Package: ₹{(prediction.college.placementData.averagePackage / 100000).toFixed(1)}L</span>
                      <span>Total Cost: ₹{(prediction.estimatedCost / 100000).toFixed(1)}L</span>
                      <span>Placement Rate: {prediction.college.placementData.placementRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
