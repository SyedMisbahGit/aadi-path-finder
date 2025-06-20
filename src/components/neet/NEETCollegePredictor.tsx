
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, DollarSign, Users, Shield, Heart } from 'lucide-react';
import type { NEETProfile, NEETRecommendation } from '@/types/neet';

interface NEETCollegePredictorProps {
  profile: NEETProfile | null;
  language: 'en' | 'hi' | 'ur';
}

export const NEETCollegePredictor = ({ profile, language }: NEETCollegePredictorProps) => {
  const [recommendations, setRecommendations] = useState<NEETRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && profile.neetScore > 0) {
      generateRecommendations();
    }
  }, [profile]);

  const generateRecommendations = async () => {
    if (!profile) return;
    
    setLoading(true);
    
    // Simulate AI-based college recommendations
    const mockRecommendations: NEETRecommendation[] = [
      {
        college: {
          id: '1',
          name: 'Government Medical College, Nagpur',
          location: 'Nagpur, Maharashtra',
          state: 'Maharashtra',
          type: 'government',
          courses: ['MBBS'],
          fees: { min: 50000, max: 100000 },
          hostelAvailable: true,
          hijabFriendly: true,
          safetyScore: 8.5,
          culturalFitScore: 9.0,
          nmcApproved: true,
          ranking: 25
        },
        admissionProbability: 75,
        safetyRating: 8,
        culturalFit: 9,
        cutoffPrediction: profile.neetScore - 20,
        aiReasoning: `Strong match for ${profile.category} category with ${profile.neetScore} marks`,
        benefits: ['Low fees', 'State quota advantage', 'Good clinical exposure'],
        riskFactors: ['High competition in Round 1'],
        estimatedCost: 400000
      },
      {
        college: {
          id: '2',
          name: 'KLE University Medical College',
          location: 'Belgaum, Karnataka',
          state: 'Karnataka',
          type: 'private',
          courses: ['MBBS', 'BDS'],
          fees: { min: 1200000, max: 1500000 },
          hostelAvailable: true,
          hijabFriendly: true,
          safetyScore: 9.0,
          culturalFitScore: 8.5,
          nmcApproved: true,
          ranking: 40
        },
        admissionProbability: 85,
        safetyRating: 9,
        culturalFit: 8,
        cutoffPrediction: profile.neetScore - 50,
        aiReasoning: 'Excellent private option with strong placement record',
        benefits: ['Modern infrastructure', 'High safety score', 'Good faculty'],
        riskFactors: ['Higher fees', 'Management quota consideration'],
        estimatedCost: 6000000
      }
    ];

    // Add more recommendations based on score and preferences
    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">
            {language === 'en' ? 'Please complete your profile first to see college predictions.' : 
             language === 'hi' ? 'कॉलेज भविष्यवाणी देखने के लिए कृपया पहले अपनी प्रोफ़ाइल पूरी करें।' : 
             'کالج کی پیش گوئی دیکھنے کے لیے برائے کرم پہلے اپنا پروفائل مکمل کریں۔'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Your Profile Summary' : 
             language === 'hi' ? 'आपकी प्रोफ़ाइल सारांश' : 
             'آپ کے پروفائل کا خلاصہ'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile.neetScore}</div>
              <div className="text-sm text-gray-500">NEET Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{profile.category.toUpperCase()}</div>
              <div className="text-sm text-gray-500">Category</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{profile.state}</div>
              <div className="text-sm text-gray-500">State</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{profile.budget}</div>
              <div className="text-sm text-gray-500">Budget</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          {language === 'en' ? 'College Recommendations' : 
           language === 'hi' ? 'कॉलेज सिफारिशें' : 
           'کالج کی سفارشات'}
        </h3>
        
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Generating recommendations...</p>
            </CardContent>
          </Card>
        ) : (
          recommendations.map((rec, index) => (
            <Card key={rec.college.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{rec.college.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{rec.college.location}</span>
                      <Badge variant={rec.college.type === 'government' ? 'default' : 'secondary'}>
                        {rec.college.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{rec.admissionProbability}%</div>
                    <div className="text-sm text-gray-500">Admission Chance</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Scores */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Safety Score</span>
                      <span className="text-sm font-semibold">{rec.safetyRating}/10</span>
                    </div>
                    <Progress value={rec.safetyRating * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Cultural Fit</span>
                      <span className="text-sm font-semibold">{rec.culturalFit}/10</span>
                    </div>
                    <Progress value={rec.culturalFit * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Predicted Cutoff</span>
                      <span className="text-sm font-semibold">{rec.cutoffPrediction}</span>
                    </div>
                    <Progress value={(rec.cutoffPrediction / 720) * 100} className="h-2" />
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {rec.college.hostelAvailable && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Hostel Available
                    </Badge>
                  )}
                  {rec.college.hijabFriendly && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Hijab Friendly
                    </Badge>
                  )}
                  {rec.college.nmcApproved && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      NMC Approved
                    </Badge>
                  )}
                </div>

                {/* Fee Information */}
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Annual Fees</span>
                    </div>
                    <span className="font-semibold">
                      ₹{rec.college.fees.min.toLocaleString()} - ₹{rec.college.fees.max.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total estimated cost: ₹{rec.estimatedCost.toLocaleString()}
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-medium text-blue-900 mb-1">AI Analysis</h4>
                  <p className="text-sm text-blue-800">{rec.aiReasoning}</p>
                </div>

                {/* Benefits and Risks */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Benefits</h4>
                    <ul className="text-sm space-y-1">
                      {rec.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">Risk Factors</h4>
                    <ul className="text-sm space-y-1">
                      {rec.riskFactors.map((risk, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
