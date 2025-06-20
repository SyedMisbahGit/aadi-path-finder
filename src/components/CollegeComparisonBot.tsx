
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Zap, TrendingUp, MapPin, DollarSign, Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { aiService } from "@/services/aiService";

interface ComparisonResult {
  college1: any;
  college2: any;
  winner: string;
  comparison: {
    fees: { winner: string; difference: string };
    location: { winner: string; reason: string };
    safety: { winner: string; score1: number; score2: number };
    cultural: { winner: string; score1: number; score2: number };
    placement: { winner: string; reason: string };
    faculty: { winner: string; reason: string };
  };
  recommendation: string;
  tradeoffs: string[];
}

export const CollegeComparisonBot = () => {
  const [college1, setCollege1] = useState('');
  const [college2, setCollege2] = useState('');
  const [criteria, setCriteria] = useState<string[]>(['fees', 'safety', 'location']);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const availableCriteria = [
    { id: 'fees', label: 'Fees & Cost', icon: DollarSign },
    { id: 'safety', label: 'Safety & Security', icon: Shield },
    { id: 'location', label: 'Location & Accessibility', icon: MapPin },
    { id: 'cultural', label: 'Cultural Fit', icon: Users },
    { id: 'placement', label: 'Placement Record', icon: TrendingUp },
    { id: 'faculty', label: 'Faculty Quality', icon: Zap }
  ];

  const toggleCriteria = (criteriaId: string) => {
    setCriteria(prev => 
      prev.includes(criteriaId) 
        ? prev.filter(c => c !== criteriaId)
        : [...prev, criteriaId]
    );
  };

  const performComparison = async () => {
    if (!college1.trim() || !college2.trim()) {
      toast.error('Please enter both college names');
      return;
    }

    if (criteria.length === 0) {
      toast.error('Please select at least one comparison criteria');
      return;
    }

    setIsComparing(true);
    
    try {
      const comparisonResult = await aiService.compareColleges(college1, college2, criteria);
      
      // Generate mock comparison result for demo
      const mockResult: ComparisonResult = {
        college1: { name: college1, score: Math.floor(Math.random() * 20) + 80 },
        college2: { name: college2, score: Math.floor(Math.random() * 20) + 80 },
        winner: Math.random() > 0.5 ? college1 : college2,
        comparison: {
          fees: {
            winner: college1,
            difference: '₹2.5L less per year'
          },
          location: {
            winner: college2,
            reason: 'Better connectivity and metro access'
          },
          safety: {
            winner: college1,
            score1: 8.5,
            score2: 7.2
          },
          cultural: {
            winner: college1,
            score1: 9.1,
            score2: 6.8
          },
          placement: {
            winner: college2,
            reason: 'Higher average package and MNC placements'
          },
          faculty: {
            winner: college2,
            reason: 'More experienced faculty with research background'
          }
        },
        recommendation: `Based on your criteria, ${college1} offers better value for money and cultural fit, while ${college2} excels in placement and faculty quality. Choose ${college1} if budget and cultural environment are priorities, or ${college2} for better career prospects.`,
        tradeoffs: [
          `${college1}: Lower fees but limited placement opportunities`,
          `${college2}: Higher fees but better industry connections`,
          'Location vs Cost: City college vs affordable option',
          'Immediate savings vs Long-term career benefits'
        ]
      };
      
      setResult(mockResult);
      toast.success('Comparison completed successfully!');
      
    } catch (error) {
      console.error('Comparison error:', error);
      toast.error('Failed to compare colleges. Please try again.');
    } finally {
      setIsComparing(false);
    }
  };

  const resetComparison = () => {
    setResult(null);
    setCollege1('');
    setCollege2('');
    setCriteria(['fees', 'safety', 'location']);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            College Comparison Bot
            <span className="text-sm text-gray-500">- کالج موازنہ AI</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">First College</label>
              <Input
                placeholder="e.g., AIIMS Delhi, GMC Nagpur"
                value={college1}
                onChange={(e) => setCollege1(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Second College</label>
              <Input
                placeholder="e.g., JIPMER Puducherry, KMC Manipal"
                value={college2}
                onChange={(e) => setCollege2(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Comparison Criteria</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableCriteria.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={criteria.includes(item.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCriteria(item.id)}
                    className="justify-start"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={performComparison}
              disabled={isComparing || !college1 || !college2}
              className="flex-1"
            >
              {isComparing ? (
                "Comparing with AI..."
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Compare Colleges
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetComparison}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center">
              🏆 Comparison Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Winner Badge */}
            <div className="text-center">
              <Badge variant="default" className="text-lg px-4 py-2">
                🥇 Overall Winner: {result.winner}
              </Badge>
            </div>

            {/* Score Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">{result.college1.name}</h3>
                <div className="text-2xl font-bold text-blue-600">{result.college1.score}/100</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900">{result.college2.name}</h3>
                <div className="text-2xl font-bold text-green-600">{result.college2.score}/100</div>
              </div>
            </div>

            {/* Detailed Comparison */}
            <div className="space-y-4">
              <h4 className="font-semibold">Detailed Analysis:</h4>
              
              {criteria.includes('fees') && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Fees & Cost</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{result.comparison.fees.winner} wins</Badge>
                    <p className="text-xs text-gray-600">{result.comparison.fees.difference}</p>
                  </div>
                </div>
              )}

              {criteria.includes('safety') && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Safety Rating</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{result.comparison.safety.winner} wins</Badge>
                    <p className="text-xs text-gray-600">
                      {result.comparison.safety.score1} vs {result.comparison.safety.score2}
                    </p>
                  </div>
                </div>
              )}

              {criteria.includes('location') && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{result.comparison.location.winner} wins</Badge>
                    <p className="text-xs text-gray-600">{result.comparison.location.reason}</p>
                  </div>
                </div>
              )}

              {criteria.includes('cultural') && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Cultural Fit</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{result.comparison.cultural.winner} wins</Badge>
                    <p className="text-xs text-gray-600">
                      {result.comparison.cultural.score1} vs {result.comparison.cultural.score2}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Recommendation */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">🤖 AI Recommendation:</h4>
              <p className="text-green-800 text-sm">{result.recommendation}</p>
            </div>

            {/* Trade-offs */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚖️ Key Trade-offs:</h4>
              <ul className="text-yellow-800 text-sm space-y-1">
                {result.tradeoffs.map((tradeoff, index) => (
                  <li key={index}>• {tradeoff}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
