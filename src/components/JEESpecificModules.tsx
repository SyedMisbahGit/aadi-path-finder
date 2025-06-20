
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, Target, TrendingUp, MapPin, BookOpen, Award } from "lucide-react";
import { toast } from "sonner";

export const JEESpecificModules = () => {
  const [percentile, setPercentile] = useState('');
  const [category, setCategory] = useState('general');
  const [state, setState] = useState('');
  const [gender, setGender] = useState('male');
  const [predictions, setPredictions] = useState<any>(null);
  const [seatMatrix, setSeatMatrix] = useState<any[]>([]);
  const [branchSuggestions, setBranchSuggestions] = useState<any[]>([]);

  // Mock data for demonstration
  const mockSeatMatrix = [
    { institute: 'IIT Delhi', cse: 45, ee: 89, me: 156, ce: 234, total: 524 },
    { institute: 'IIT Bombay', cse: 38, ee: 82, me: 142, ce: 198, total: 460 },
    { institute: 'IIT Madras', cse: 52, ee: 95, me: 178, ce: 267, total: 592 },
    { institute: 'IIT Kanpur', cse: 48, ee: 88, me: 165, ce: 245, total: 546 },
    { institute: 'NIT Trichy', cse: 125, ee: 186, me: 234, ce: 298, total: 843 }
  ];

  const branchColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  const predictCutoffs = async () => {
    if (!percentile || !category) {
      toast.error('Please enter percentile and select category');
      return;
    }

    const score = parseFloat(percentile);
    
    // AI-based prediction logic
    const predictions = {
      iit: {
        possible: score >= 99.5,
        branches: score >= 99.8 ? ['CSE', 'EE'] : score >= 99.5 ? ['EE', 'ME', 'CE'] : [],
        bestIIT: score >= 99.9 ? 'IIT Delhi/Bombay' : score >= 99.5 ? 'IIT Guwahati/Ropar' : 'None'
      },
      nit: {
        possible: score >= 95,
        branches: score >= 98 ? ['CSE', 'ECE'] : score >= 95 ? ['ME', 'EE', 'CE'] : [],
        bestNIT: score >= 98 ? 'NIT Trichy/Warangal' : score >= 95 ? 'NIT Kurukshetra/Allahabad' : 'None'
      },
      iiit: {
        possible: score >= 92,
        branches: score >= 96 ? ['CSE', 'IT'] : score >= 92 ? ['ECE', 'EE'] : [],
        bestIIIT: score >= 96 ? 'IIIT Hyderabad/Delhi' : score >= 92 ? 'IIIT Bangalore/Pune' : 'None'
      },
      gfti: {
        possible: score >= 85,
        branches: ['ME', 'EE', 'CE', 'ECE'],
        bestOption: 'DTU/NSUT/IIIT Delhi'
      }
    };

    setPredictions(predictions);
    setSeatMatrix(mockSeatMatrix);
    
    // Generate branch suggestions
    const suggestions = [
      {
        branch: 'Computer Science & Engineering',
        probability: Math.max(0, Math.min(100, (score - 95) * 5)),
        averagePackage: '12-25 LPA',
        topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Facebook'],
        futureScope: 'Excellent with AI/ML boom'
      },
      {
        branch: 'Electronics & Communication',
        probability: Math.max(0, Math.min(100, (score - 90) * 5)),
        averagePackage: '8-18 LPA',
        topRecruiters: ['Intel', 'Qualcomm', 'Broadcom', 'TI'],
        futureScope: 'Growing with IoT and 5G'
      },
      {
        branch: 'Mechanical Engineering',
        probability: Math.max(0, Math.min(100, (score - 85) * 6)),
        averagePackage: '6-15 LPA',
        topRecruiters: ['Tata Motors', 'Mahindra', 'L&T', 'Bajaj'],
        futureScope: 'Stable with automation trends'
      }
    ];

    setBranchSuggestions(suggestions);
    toast.success('JEE predictions generated successfully!');
  };

  const seatMatrixData = seatMatrix.map(item => ({
    name: item.institute,
    CSE: item.cse,
    EE: item.ee,
    ME: item.me,
    CE: item.ce
  }));

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            JEE Cutoff Predictor & Branch Advisor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">JEE Main Percentile</label>
              <Input
                type="number"
                placeholder="e.g., 98.5"
                value={percentile}
                onChange={(e) => setPercentile(e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="obc">OBC-NCL</SelectItem>
                  <SelectItem value="sc">SC</SelectItem>
                  <SelectItem value="st">ST</SelectItem>
                  <SelectItem value="ews">EWS</SelectItem>
                  <SelectItem value="pwd">PwD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Home State</label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Gender</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={predictCutoffs} className="w-full">
            <Target className="w-4 h-4 mr-2" />
            Generate AI Predictions
          </Button>
        </CardContent>
      </Card>

      {predictions && (
        <>
          {/* Predictions Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Your JEE Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900">IIT Chances</h3>
                  <Badge variant={predictions.iit.possible ? "default" : "secondary"} className="mt-2">
                    {predictions.iit.possible ? "Possible" : "Difficult"}
                  </Badge>
                  <p className="text-xs text-blue-700 mt-1">{predictions.iit.bestIIT}</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900">NIT Chances</h3>
                  <Badge variant={predictions.nit.possible ? "default" : "secondary"} className="mt-2">
                    {predictions.nit.possible ? "Good" : "Low"}
                  </Badge>
                  <p className="text-xs text-green-700 mt-1">{predictions.nit.bestNIT}</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900">IIIT Chances</h3>
                  <Badge variant={predictions.iiit.possible ? "default" : "secondary"} className="mt-2">
                    {predictions.iiit.possible ? "Good" : "Moderate"}
                  </Badge>
                  <p className="text-xs text-purple-700 mt-1">{predictions.iiit.bestIIIT}</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-900">GFTI Chances</h3>
                  <Badge variant={predictions.gfti.possible ? "default" : "secondary"} className="mt-2">
                    {predictions.gfti.possible ? "Excellent" : "Moderate"}
                  </Badge>
                  <p className="text-xs text-orange-700 mt-1">{predictions.gfti.bestOption}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seat Matrix Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Seat Matrix Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={seatMatrixData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="CSE" fill="#8884d8" />
                  <Bar dataKey="EE" fill="#82ca9d" />
                  <Bar dataKey="ME" fill="#ffc658" />
                  <Bar dataKey="CE" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Branch Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Branch Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branchSuggestions.map((branch, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{branch.branch}</h3>
                      <Badge variant={branch.probability > 70 ? "default" : branch.probability > 40 ? "secondary" : "outline"}>
                        {branch.probability.toFixed(0)}% chance
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Average Package:</span>
                        <p className="text-green-600">{branch.averagePackage}</p>
                      </div>
                      <div>
                        <span className="font-medium">Top Recruiters:</span>
                        <p className="text-blue-600">{branch.topRecruiters.join(', ')}</p>
                      </div>
                      <div>
                        <span className="font-medium">Future Scope:</span>
                        <p className="text-purple-600">{branch.futureScope}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* IIT vs NIT Trade-off Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                IIT vs NIT vs IIIT Trade-off Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">🏛️ IIT Benefits</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Prestigious brand value</li>
                    <li>• Excellent research opportunities</li>
                    <li>• Global recognition</li>
                    <li>• Strong alumni network</li>
                    <li>• Higher starting packages</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">🏢 NIT Benefits</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• More accessible cutoffs</li>
                    <li>• Regional advantages</li>
                    <li>• Good placement records</li>
                    <li>• State quota benefits</li>
                    <li>• Balanced academic life</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">💻 IIIT Benefits</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• IT/CS specialization</li>
                    <li>• Industry partnerships</li>
                    <li>• Modern infrastructure</li>
                    <li>• Startup ecosystem</li>
                    <li>• Focused curriculum</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">🤔 Decision Framework:</h4>
                <p className="text-sm text-yellow-800">
                  <strong>Choose IIT if:</strong> You want maximum prestige and research opportunities<br/>
                  <strong>Choose top NIT if:</strong> You want good placement with less competition<br/>
                  <strong>Choose IIIT if:</strong> You're focused on IT/CS and want industry exposure
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
