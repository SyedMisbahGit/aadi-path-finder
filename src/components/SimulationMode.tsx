
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, AlertTriangle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SimulationResult {
  scenario: string;
  admissionProbability: number;
  expectedRank: number;
  topColleges: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export const SimulationMode = () => {
  const [simulationData, setSimulationData] = useState({
    examType: '',
    baseScore: '',
    category: '',
    scenarios: [
      { name: 'Best Case', scoreModifier: 20 },
      { name: 'Expected', scoreModifier: 0 },
      { name: 'Worst Case', scoreModifier: -15 }
    ]
  });
  
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async () => {
    if (!simulationData.baseScore || !simulationData.examType || !simulationData.category) {
      return;
    }

    setIsSimulating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const baseScore = parseInt(simulationData.baseScore);
    const mockResults: SimulationResult[] = simulationData.scenarios.map(scenario => {
      const adjustedScore = baseScore + scenario.scoreModifier;
      const admissionProbability = Math.min(95, Math.max(5, (adjustedScore / 720) * 100));
      
      // Mock rank calculation based on score and category
      let expectedRank = Math.max(1, Math.floor((720 - adjustedScore) * 150));
      if (simulationData.category === 'obc') expectedRank = Math.floor(expectedRank * 0.8);
      if (simulationData.category === 'sc') expectedRank = Math.floor(expectedRank * 0.6);
      if (simulationData.category === 'st') expectedRank = Math.floor(expectedRank * 0.5);
      
      const topColleges = adjustedScore > 600 
        ? ['IIT Delhi', 'IIT Bombay', 'IIT Madras']
        : adjustedScore > 500
        ? ['NIT Trichy', 'NIT Surathkal', 'IIIT Hyderabad']
        : ['State Engineering Colleges', 'Private Colleges', 'Regional Institutes'];
      
      const riskLevel: 'low' | 'medium' | 'high' = 
        admissionProbability > 70 ? 'low' :
        admissionProbability > 40 ? 'medium' : 'high';
      
      return {
        scenario: scenario.name,
        admissionProbability,
        expectedRank,
        topColleges,
        riskLevel
      };
    });
    
    setResults(mockResults);
    setIsSimulating(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'Best Case': return 'border-green-200 bg-green-50';
      case 'Expected': return 'border-blue-200 bg-blue-50';
      case 'Worst Case': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          🧪 Simulation Mode
        </h2>
        <p className="text-gray-600 mt-2">
          Explore different scenarios to understand your admission chances
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Simulation Mode:</strong> This is a hypothetical analysis tool. 
          Results are not final and should only be used for planning purposes.
        </AlertDescription>
      </Alert>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Simulation Parameters</CardTitle>
          <CardDescription>Enter your details to run different scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="examType">Exam Type</Label>
              <Select onValueChange={(value) => setSimulationData(prev => ({...prev, examType: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jee-main">JEE Main</SelectItem>
                  <SelectItem value="jee-advanced">JEE Advanced</SelectItem>
                  <SelectItem value="neet-ug">NEET UG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="baseScore">Base Score</Label>
              <Input
                id="baseScore"
                type="number"
                value={simulationData.baseScore}
                onChange={(e) => setSimulationData(prev => ({...prev, baseScore: e.target.value}))}
                placeholder="Enter your expected score"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setSimulationData(prev => ({...prev, category: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="obc">OBC</SelectItem>
                  <SelectItem value="sc">SC</SelectItem>
                  <SelectItem value="st">ST</SelectItem>
                  <SelectItem value="ews">EWS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={runSimulation} 
            disabled={isSimulating || !simulationData.baseScore}
            className="w-full"
          >
            {isSimulating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Running Simulation...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Run Scenario Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Simulation Results</h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            {results.map((result, index) => (
              <Card key={index} className={`${getScenarioColor(result.scenario)} border-2`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{result.scenario}</CardTitle>
                    <Badge className={getRiskColor(result.riskLevel)}>
                      {result.riskLevel} risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Admission Probability</span>
                      <span className="text-lg font-bold text-blue-600">
                        {result.admissionProbability.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={result.admissionProbability} className="h-2" />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Expected Rank</p>
                    <p className="text-xl font-bold text-purple-600">
                      {result.expectedRank.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Likely Colleges</p>
                    <div className="space-y-1">
                      {result.topColleges.map((college, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {college}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Summary Insights */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <TrendingUp className="w-5 h-5" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• <strong>Range:</strong> Your rank could vary from {Math.min(...results.map(r => r.expectedRank)).toLocaleString()} to {Math.max(...results.map(r => r.expectedRank)).toLocaleString()}</p>
                <p>• <strong>Preparation Impact:</strong> A 20-point improvement could boost your chances by {(results[0].admissionProbability - results[1].admissionProbability).toFixed(1)}%</p>
                <p>• <strong>Risk Management:</strong> Have backup options ready for the worst-case scenario</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
