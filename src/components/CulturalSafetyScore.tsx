
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Heart, MapPin } from "lucide-react";

interface SafetyData {
  overallScore: number;
  femaleHostel: boolean;
  culturalInclusive: boolean;
  minorityFriendly: boolean;
  campusSafety: number;
  cityRating: number;
  reviews: string[];
}

interface CulturalSafetyScoreProps {
  collegeId: string;
  collegeName: string;
  safetyData?: SafetyData;
}

export const CulturalSafetyScore = ({ collegeId, collegeName, safetyData }: CulturalSafetyScoreProps) => {
  // Mock data - in production, this would come from a comprehensive database
  const mockSafetyData: SafetyData = safetyData || {
    overallScore: 8.5,
    femaleHostel: true,
    culturalInclusive: true,
    minorityFriendly: true,
    campusSafety: 9,
    cityRating: 7,
    reviews: [
      "Safe environment for female students",
      "Respectful towards hijab and cultural practices",
      "Good campus security with 24/7 monitoring"
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return { text: 'Highly Safe', variant: 'default' as const, emoji: '🟢' };
    if (score >= 6) return { text: 'Moderately Safe', variant: 'secondary' as const, emoji: '🟡' };
    return { text: 'Caution Advised', variant: 'destructive' as const, emoji: '🔴' };
  };

  const scoreBadge = getScoreBadge(mockSafetyData.overallScore);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5" />
          Cultural & Safety Assessment
          <span className="text-sm text-gray-500">ثقافتی اور حفاظتی جائزہ</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className={`p-4 rounded-lg border ${getScoreColor(mockSafetyData.overallScore)}`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Overall Safety Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{mockSafetyData.overallScore}/10</span>
              <Badge variant={scoreBadge.variant}>
                {scoreBadge.emoji} {scoreBadge.text}
              </Badge>
            </div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Female Hostel</span>
            <Badge variant={mockSafetyData.femaleHostel ? "default" : "secondary"}>
              {mockSafetyData.femaleHostel ? "✓ Available" : "Not Available"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-600" />
            <span className="text-sm">Hijab Friendly</span>
            <Badge variant={mockSafetyData.culturalInclusive ? "default" : "secondary"}>
              {mockSafetyData.culturalInclusive ? "✓ Yes" : "Unclear"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm">Campus Security</span>
            <Badge variant="outline">
              {mockSafetyData.campusSafety}/10
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-sm">City Safety</span>
            <Badge variant="outline">
              {mockSafetyData.cityRating}/10
            </Badge>
          </div>
        </div>

        {/* Student Reviews */}
        <div>
          <h4 className="font-semibold mb-2">What Students Say / طلباء کیا کہتے ہیں:</h4>
          <div className="space-y-2">
            {mockSafetyData.reviews.map((review, index) => (
              <div key={index} className="text-sm bg-gray-50 p-2 rounded border-l-4 border-blue-200">
                "{review}"
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Compatibility */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-1">Cultural Compatibility / ثقافتی مطابقت</h4>
          <p className="text-sm text-blue-800">
            {mockSafetyData.minorityFriendly && mockSafetyData.culturalInclusive
              ? "✅ This college has a welcoming environment for students from all backgrounds and religious practices. / یہ کالج تمام پس منظر اور مذہبی طریقوں کے طلباء کے لیے خوش آمدید ماحول رکھتا ہے۔"
              : "⚠️ Limited information available about cultural inclusivity. We recommend contacting the college directly. / ثقافتی شمولیت کے بارے میں محدود معلومات دستیاب ہیں۔"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
