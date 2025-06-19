
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Stethoscope, Calculator, Zap, Info } from "lucide-react";

interface ExamSelectionGatewayProps {
  onExamSelect: (exams: string[]) => void;
  selectedExams: string[];
}

export const ExamSelectionGateway = ({ onExamSelect, selectedExams }: ExamSelectionGatewayProps) => {
  const [tempSelectedExams, setTempSelectedExams] = useState<string[]>(selectedExams);

  const examOptions = [
    {
      id: 'neet-ug',
      title: 'NEET UG 2025',
      icon: <Stethoscope className="w-6 h-6" />,
      description: 'Medical & Dental College Counseling',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500',
      details: [
        'MBBS, BDS, AYUSH courses',
        'AIQ, State, Deemed university options',
        'MCC counseling rounds',
        'Category-wise reservations'
      ]
    },
    {
      id: 'jee-main',
      title: 'JEE Main 2025',
      icon: <Calculator className="w-6 h-6" />,
      description: 'Engineering College Counseling',
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-500',
      details: [
        'NITs, IIITs, GFTIs',
        'JoSAA counseling',
        'State quota engineering',
        'CSAB special rounds'
      ]
    },
    {
      id: 'jee-advanced',
      title: 'JEE Advanced 2025',
      icon: <Zap className="w-6 h-6" />,
      description: 'IIT Admission Counseling',
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-500',
      details: [
        'All 23 IITs',
        'JoSAA IIT rounds',
        'Branch-wise allocation',
        'Gender-neutral/Female-only'
      ]
    }
  ];

  const handleExamToggle = (examId: string) => {
    setTempSelectedExams(prev => 
      prev.includes(examId) 
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleProceed = () => {
    if (tempSelectedExams.length > 0) {
      onExamSelect(tempSelectedExams);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🤖 Welcome to Al-Naseeh</h2>
        <p className="text-lg text-gray-600 mb-4">الناصح - Your Honest AI Advisor</p>
        <p className="text-gray-600">Select the exam(s) you appeared for to get personalized counseling</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {examOptions.map((exam) => {
          const isSelected = tempSelectedExams.includes(exam.id);
          
          return (
            <Card 
              key={exam.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isSelected 
                  ? `ring-2 ring-offset-2 ${exam.borderColor.replace('border-', 'ring-')} shadow-lg` 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleExamToggle(exam.id)}
            >
              <CardHeader className="text-center">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${exam.color} text-white`}>
                    {exam.icon}
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleExamToggle(exam.id)}
                    className="ml-2"
                  />
                </div>
                <CardTitle className="text-xl">{exam.title}</CardTitle>
                <CardDescription className="text-sm">
                  {exam.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  {exam.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tempSelectedExams.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900">Selected Exams</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tempSelectedExams.map(examId => {
                    const exam = examOptions.find(e => e.id === examId);
                    return (
                      <Badge key={examId} variant="secondary">
                        {exam?.title}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-sm text-blue-800 mt-2">
                  ✨ <strong>No signup required!</strong> Your data stays private and is stored locally.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={handleProceed}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continue to Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
