
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calculator, ArrowRight, BookOpen, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState<string>("");

  const examOptions = [
    {
      id: 'neet',
      title: 'NEET UG 2025',
      icon: <Stethoscope className="w-8 h-8" />,
      description: 'Medical & Dental College Counseling',
      color: 'from-green-500 to-emerald-600',
      features: [
        'MBBS, BDS, AYUSH courses',
        'AIQ & State quota counseling',
        'Government & Private colleges',
        'Cultural fit & safety scores',
        'Hostel availability filters'
      ],
      route: '/neet'
    },
    {
      id: 'jee',
      title: 'JEE Main 2025',
      icon: <Calculator className="w-8 h-8" />,
      description: 'Engineering College Counseling',
      color: 'from-blue-500 to-cyan-600',
      features: [
        'NITs, IIITs, GFTIs',
        'JoSAA counseling rounds',
        'Branch-wise predictions',
        'Placement data insights',
        'Fee comparison tools'
      ],
      route: '/jee'
    }
  ];

  const handleExamSelect = (examId: string, route: string) => {
    setSelectedExam(examId);
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🤖 Al-Naseeh
          </h1>
          <p className="text-xl text-gray-600 mb-2">الناصح - Your Honest AI Advisor</p>
          <p className="text-lg text-gray-500">Choose your exam for personalized counseling guidance</p>
        </div>

        {/* Exam Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {examOptions.map((exam) => (
            <Card 
              key={exam.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
                selectedExam === exam.id ? 'ring-4 ring-blue-200 shadow-xl' : 'hover:border-blue-200'
              }`}
              onClick={() => setSelectedExam(exam.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${exam.color} text-white mb-4`}>
                  {exam.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{exam.title}</CardTitle>
                <CardDescription className="text-base">
                  {exam.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {exam.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExamSelect(exam.id, exam.route);
                  }}
                  className={`w-full bg-gradient-to-r ${exam.color} hover:opacity-90`}
                  size="lg"
                >
                  Start {exam.id.toUpperCase()} Counseling
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">Why Choose Al-Naseeh?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">AI-Powered Predictions</h3>
              <p className="text-sm text-gray-600">Real-time cutoff analysis and college recommendations</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Cultural Awareness</h3>
              <p className="text-sm text-gray-600">Safety scores, hostel facilities, and cultural fit assessment</p>
            </div>
            <div className="text-center">
              <Calculator className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Accurate Data</h3>
              <p className="text-sm text-gray-600">Live counseling data from official sources</p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <p className="text-blue-800">
            <strong>Privacy First:</strong> No signup required. Your data stays private and is stored locally.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
