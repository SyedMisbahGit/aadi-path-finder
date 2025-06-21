
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Stethoscope, Calculator, ArrowRight, Shield, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900">Al-Naseeh</h1>
              <p className="text-xl text-gray-600 mt-1">الناصح - Your AI Career Counselor</p>
            </div>
          </div>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Fully autonomous AI-powered counseling platform for NEET UG and JEE Main students. 
            Get personalized college recommendations with real-time data, safety scores, and cultural considerations.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">100% Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Real-time Data</span>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/ai-counselor')} 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Brain className="w-6 h-6 mr-2" />
            Start AI Counseling Session
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">NEET UG Counseling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Complete medical college guidance with safety scores, cultural fit analysis, and real-time MCC counseling data.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Government & Private Medical Colleges
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Cultural Safety & Hijab-friendly Analysis
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  State Quota & Category-wise Predictions
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/neet')}
                className="w-full"
              >
                Explore NEET Counseling
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">JEE Main Counseling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Engineering college recommendations with branch analysis, placement data, and JoSAA counseling insights.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  NITs, IIITs, GFTIs Analysis
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Branch vs Placement Trade-offs
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Percentile to Rank Conversion
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/jee')}
                className="w-full"
              >
                Explore JEE Counseling
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">AI Counselor Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Natural language conversation with AI. No forms - just tell me your scores, preferences, and get instant guidance!
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Natural Language Processing
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Handles Incomplete Information
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Parent-friendly Explanations
                </div>
              </div>
              <Button 
                onClick={() => navigate('/ai-counselor')}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                Start Chat Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Al-Naseeh?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Predictions</h3>
              <p className="text-sm text-gray-600">ML models trained on years of counseling data for accurate cutoff predictions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Safety Analysis</h3>
              <p className="text-sm text-gray-600">Real-time safety scores based on news analysis and regional reports</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Live Data</h3>
              <p className="text-sm text-gray-600">Autonomous crawling of MCC, JoSAA, and state counseling websites</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Cultural Awareness</h3>
              <p className="text-sm text-gray-600">Hijab-friendly, dietary, and cultural considerations in recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
