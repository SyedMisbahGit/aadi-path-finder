
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Shield, 
  Users, 
  BookOpen,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface PredictionResultsProps {
  predictions: any[];
  studentProfile: any;
  confidence: number;
}

export const PredictionResults = ({ predictions, studentProfile, confidence }: PredictionResultsProps) => {
  if (!predictions || predictions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No predictions available. Please provide your exam details.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAdmissionBadgeColor = (probability: number) => {
    if (probability >= 70) return "bg-green-500";
    if (probability >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAdmissionText = (probability: number) => {
    if (probability >= 70) return "High Chance";
    if (probability >= 40) return "Moderate Chance";
    return "Low Chance";
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            AI Prediction Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {predictions.filter(p => p.prediction.admissionProbability >= 70).length}
              </div>
              <div className="text-sm text-gray-600">High Probability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {predictions.filter(p => p.prediction.admissionProbability >= 40 && p.prediction.admissionProbability < 70).length}
              </div>
              <div className="text-sm text-gray-600">Moderate Probability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {confidence.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">AI Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictions List */}
      <div className="space-y-4">
        {predictions.slice(0, 10).map((prediction, index) => (
          <Card key={prediction.college.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {prediction.college.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{prediction.college.location}, {prediction.college.state}</span>
                  </div>
                </div>
                <Badge 
                  className={`${getAdmissionBadgeColor(prediction.prediction.admissionProbability)} text-white`}
                >
                  {getAdmissionText(prediction.prediction.admissionProbability)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Admission Probability</div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={prediction.prediction.admissionProbability} 
                      className="flex-1"
                    />
                    <span className="text-sm font-medium">
                      {prediction.prediction.admissionProbability}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Annual Fees</div>
                    <div className="font-medium">
                      ₹{prediction.college.fees.min?.toLocaleString()} - ₹{prediction.college.fees.max?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Safety Score</div>
                    <div className="font-medium">
                      {prediction.college.facilities.safety_score}/10
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">Placement Score</div>
                    <div className="font-medium">
                      {prediction.college.facilities.placement_score}/10
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">AI Reasoning:</div>
                    <div className="text-sm text-gray-600">{prediction.reasoning}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">
                  {prediction.college.type.toUpperCase()}
                </Badge>
                {prediction.college.facilities.hostel && (
                  <Badge variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Hostel Available
                  </Badge>
                )}
                {prediction.college.courses.map((course: string) => (
                  <Badge key={course} variant="secondary">
                    {course}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
