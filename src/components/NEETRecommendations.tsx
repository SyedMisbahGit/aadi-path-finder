
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Shield, Users, BookOpen, Star, Hospital, GraduationCap } from "lucide-react";

interface NEETRecommendation {
  id: string;
  rank: number;
  collegeName: string;
  location: string;
  state: string;
  type: 'government' | 'private' | 'deemed' | 'aiims';
  course: string;
  admissionProbability: number;
  safetyRating: number;
  culturalFit: number;
  financialFeasibility: number;
  annualFeesMin: number;
  annualFeesMax: number;
  totalCostEstimation: number;
  predictedCutoff: number;
  quotaType: 'AIQ' | 'State' | 'Management' | 'NRI';
  hostelAvailable: boolean;
  scholarshipAvailable: boolean;
  aiReasoning: string;
  benefits: string[];
  riskFactors: string[];
  scholarshipEligibility: string[];
  establishedYear: number;
  naccGrade: string;
  hospitalBeds: number;
  facultyRatio: string;
}

interface NEETRecommendationsProps {
  assessmentData: any;
}

export const NEETRecommendations = ({ assessmentData }: NEETRecommendationsProps) => {
  // Mock NEET-specific recommendations data
  const recommendations: NEETRecommendation[] = [
    {
      id: '1',
      rank: 1,
      collegeName: 'Government Medical College, Thiruvananthapuram',
      location: 'Thiruvananthapuram',
      state: 'Kerala',
      type: 'government',
      course: 'MBBS',
      admissionProbability: 95,
      safetyRating: 9,
      culturalFit: 8,
      financialFeasibility: 10,
      annualFeesMin: 15000,
      annualFeesMax: 25000,
      totalCostEstimation: 200000,
      predictedCutoff: 550,
      quotaType: 'AIQ',
      hostelAvailable: true,
      scholarshipAvailable: true,
      aiReasoning: "Excellent safety college for your NEET rank. Government fees, good clinical exposure, and strong placement record in PG entrance exams.",
      benefits: [
        "Very low fees (₹15,000/year)",
        "Excellent clinical training",
        "High PG-NEET success rate",
        "Well-established medical college",
        "Good hostel facilities"
      ],
      riskFactors: [
        "Highly competitive environment",
        "Limited management quota seats"
      ],
      scholarshipEligibility: [
        "State Merit Scholarship",
        "Central Sector Scholarship"
      ],
      establishedYear: 1951,
      naccGrade: 'A+',
      hospitalBeds: 1200,
      facultyRatio: '1:10'
    },
    {
      id: '2',
      rank: 2,
      collegeName: 'Kasturba Medical College, Mangalore',
      location: 'Mangalore',
      state: 'Karnataka',
      type: 'private',
      course: 'MBBS',
      admissionProbability: 85,
      safetyRating: 8,
      culturalFit: 9,
      financialFeasibility: 6,
      annualFeesMin: 1100000,
      annualFeesMax: 1300000,
      totalCostEstimation: 6500000,
      predictedCutoff: 580,
      quotaType: 'Management',
      hostelAvailable: true,
      scholarshipAvailable: true,
      aiReasoning: "Top private medical college with excellent infrastructure and international recognition. Higher fees but exceptional quality of education.",
      benefits: [
        "International recognition",
        "Modern infrastructure",
        "Strong alumni network",
        "Good research opportunities",
        "Multicultural environment"
      ],
      riskFactors: [
        "High fees structure",
        "Competitive admission process"
      ],
      scholarshipEligibility: [
        "Merit-based scholarship",
        "Need-based financial aid"
      ],
      establishedYear: 1953,
      naccGrade: 'A++',
      hospitalBeds: 2000,
      facultyRatio: '1:8'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'deemed': return 'bg-purple-100 text-purple-800';
      case 'aiims': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuotaColor = (quota: string) => {
    switch (quota) {
      case 'AIQ': return 'bg-green-500';
      case 'State': return 'bg-blue-500';
      case 'Management': return 'bg-purple-500';
      case 'NRI': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">🩺 Your NEET 2025 College Recommendations</h2>
        <p className="text-gray-600 mt-2">Al-Naseeh's personalized medical college suggestions based on your NEET performance</p>
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <p className="text-sm">
            <strong>Your Profile:</strong> NEET Rank {assessmentData?.neetRank}, Score {assessmentData?.neetScore}/720, 
            Category: {assessmentData?.category?.toUpperCase()}, State: {assessmentData?.domicileState}
          </p>
        </div>
      </div>

      {recommendations.map((rec) => (
        <Card key={rec.id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    #{rec.rank}
                  </span>
                  <span className="text-lg">{rec.collegeName}</span>
                  <Badge className={getTypeColor(rec.type)}>
                    {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {rec.location}, {rec.state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Hospital className="w-4 h-4" />
                    {rec.course}
                  </div>
                  <Badge variant="outline" className={`${getQuotaColor(rec.quotaType)} text-white border-0`}>
                    {rec.quotaType} Quota
                  </Badge>
                </CardDescription>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-green-600">
                  {rec.admissionProbability}%
                </div>
                <div className="text-sm text-gray-500">Admission Chance</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* AI Reasoning */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                🤖 Al-Naseeh Analysis
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">{rec.aiReasoning}</p>
            </div>

            {/* College Stats */}
            <div className="grid md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{rec.establishedYear}</div>
                <div className="text-xs text-gray-600">Established</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{rec.naccGrade}</div>
                <div className="text-xs text-gray-600">NAAC Grade</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{rec.hospitalBeds}</div>
                <div className="text-xs text-gray-600">Hospital Beds</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{rec.facultyRatio}</div>
                <div className="text-xs text-gray-600">Faculty Ratio</div>
              </div>
            </div>

            {/* Scores Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium">Safety</span>
                </div>
                <Progress value={rec.safetyRating * 10} className="mb-1" />
                <span className="text-sm text-gray-600">{rec.safetyRating}/10</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="font-medium">Cultural Fit</span>
                </div>
                <Progress value={rec.culturalFit * 10} className="mb-1" />
                <span className="text-sm text-gray-600">{rec.culturalFit}/10</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">Financial</span>
                </div>
                <Progress value={rec.financialFeasibility * 10} className="mb-1" />
                <span className="text-sm text-gray-600">{rec.financialFeasibility}/10</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-medium">Overall</span>
                </div>
                <Progress value={(rec.safetyRating + rec.culturalFit + rec.financialFeasibility) / 3 * 10} className="mb-1" />
                <span className="text-sm text-gray-600">{Math.round((rec.safetyRating + rec.culturalFit + rec.financialFeasibility) / 3)}/10</span>
              </div>
            </div>

            <Separator />

            {/* Financial Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cost Breakdown (5.5 years)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Annual Fees:</span>
                    <span>₹{rec.annualFeesMin.toLocaleString()} - ₹{rec.annualFeesMax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Course Cost:</span>
                    <span className="font-medium">₹{rec.totalCostEstimation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Predicted Cutoff 2025:</span>
                    <span className="font-medium">{rec.predictedCutoff} marks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hostel Available:</span>
                    <span>{rec.hostelAvailable ? '✅ Yes' : '❌ No'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Course Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Course:</span>
                    <span className="font-medium">{rec.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>5.5 years (4.5 + 1 yr internship)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quota Type:</span>
                    <span className="font-medium">{rec.quotaType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats Available:</span>
                    <span>~150-200 MBBS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits and Risk Factors */}
            <Separator />
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">✅ Key Benefits</h4>
                <ul className="text-sm space-y-1">
                  {rec.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-green-600">• {benefit}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-orange-700 mb-2">⚠️ Consider These</h4>
                <ul className="text-sm space-y-1">
                  {rec.riskFactors.map((risk, idx) => (
                    <li key={idx} className="text-orange-600">• {risk}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Scholarship Information */}
            {rec.scholarshipEligibility.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-purple-700 mb-2">🎓 Scholarship Opportunities</h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.scholarshipEligibility.map((scholarship, idx) => (
                      <Badge key={idx} variant="outline" className="text-purple-600 border-purple-300">
                        {scholarship}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button variant="outline" size="sm">
                Compare
              </Button>
              <Button variant="outline" size="sm">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">🎯 Need More Options?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Al-Naseeh can analyze more colleges based on your preferences and backup options.
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <Button variant="outline" size="sm">Show More Colleges</Button>
          <Button variant="outline" size="sm">Modify Preferences</Button>
          <Button variant="outline" size="sm">Backup Options</Button>
        </div>
      </div>
    </div>
  );
};
