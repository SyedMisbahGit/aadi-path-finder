import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAssessment } from "@/hooks/useAssessment";
import { AuthModal } from "@/components/AuthModal";
import { AIRecommendations } from "@/components/AIRecommendations";
import { CounselingTracker } from "@/components/CounselingTracker";
import { ExportRecommendations } from "@/components/ExportRecommendations";
import { AdmissionTimeline } from "@/components/AdmissionTimeline";
import { SimulationMode } from "@/components/SimulationMode";
import { NEETAssessmentForm } from "@/components/NEETAssessmentForm";
import { NEETRecommendations } from "@/components/NEETRecommendations";
import { JEEMainAssessmentForm } from "@/components/JEEMainAssessmentForm";
import { JEEAdvancedAssessmentForm } from "@/components/JEEAdvancedAssessmentForm";
import { ExamSelectionGateway } from "@/components/ExamSelectionGateway";
import { toast } from "sonner";
import { ConversationalAI } from "@/components/ConversationalAI";
import { CulturalSafetyScore } from "@/components/CulturalSafetyScore";
import { ParentReport } from "@/components/ParentReport";
import { IntelligentChatAI } from "@/components/IntelligentChatAI";
import { AlertSystem } from "@/components/AlertSystem";

const Assessment = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [activeExamTab, setActiveExamTab] = useState<string>('');
  const [activeTab, setActiveTab] = useState('assessment');
  const [assessmentData, setAssessmentData] = useState<any>({});
  const [submittedAssessments, setSubmittedAssessments] = useState<Record<string, string>>({});
  const [showConversationalMode, setShowConversationalMode] = useState(false);
  const { user } = useAuth();
  const { saveAssessment, clearLocalData, loadAssessmentFromLocal } = useAssessment();

  // Load previous session data on component mount
  useState(() => {
    const savedData = loadAssessmentFromLocal();
    if (savedData && Object.keys(savedData).length > 2) {
      // Load previous session data
      const examTypes = [];
      if (savedData.neet) {
        examTypes.push('neet-ug');
        setAssessmentData(prev => ({ ...prev, 'neet-ug': savedData.neet }));
      }
      if (savedData.jeeMain) {
        examTypes.push('jee-main');
        setAssessmentData(prev => ({ ...prev, 'jee-main': savedData.jeeMain }));
      }
      if (savedData.jeeAdvanced) {
        examTypes.push('jee-advanced');
        setAssessmentData(prev => ({ ...prev, 'jee-advanced': savedData.jeeAdvanced }));
      }
      
      if (examTypes.length > 0) {
        setSelectedExams(examTypes);
        setActiveExamTab(examTypes[0]);
        toast.info("Previous session data loaded");
      }
    }
  });

  const handleExamSelect = (exams: string[]) => {
    setSelectedExams(exams);
    setActiveExamTab(exams[0]);
  };

  const handleNEETSubmit = async (data: any) => {
    try {
      const result = await saveAssessment.mutateAsync({
        examName: 'neet-ug',
        examYear: '2025',
        marks: data.neetScore,
        totalMarks: '720',
        category: data.category,
        gender: data.gender,
        domicileState: data.domicileState,
        preferredStates: data.preferredStates || [],
        budgetRange: data.budgetRange,
        hostOrDay: 'both',
        religiousPractices: data.religiousPractices,
        specialNeeds: data.specialNeeds,
        collegeType: data.collegePreference,
        climatePreference: 'no-preference',
        languagePreference: 'english',
        additionalInfo: data.additionalInfo
      });
      
      setAssessmentData(prev => ({ ...prev, 'neet-ug': data }));
      setSubmittedAssessments(prev => ({ ...prev, 'neet-ug': result.id || 'local-neet' }));
      setActiveTab('recommendations');
      toast.success("NEET assessment completed! Al-Naseeh is analyzing your options...");
    } catch (error) {
      console.error('Error submitting NEET assessment:', error);
      toast.error("Failed to save assessment. Please try again.");
    }
  };

  const handleJEEMainSubmit = async (data: any) => {
    try {
      const result = await saveAssessment.mutateAsync({
        examName: 'jee-main',
        examYear: '2025',
        marks: data.jeeMainPercentile,
        totalMarks: '100',
        category: data.category,
        gender: data.gender,
        domicileState: data.homeState,
        preferredStates: [data.homeState],
        budgetRange: data.budgetRange,
        hostOrDay: 'both',
        religiousPractices: '',
        specialNeeds: '',
        collegeType: data.collegeTypePreference,
        climatePreference: 'no-preference',
        languagePreference: data.languagePreference,
        additionalInfo: data.additionalInfo
      });
      
      setAssessmentData(prev => ({ ...prev, 'jee-main': data }));
      setSubmittedAssessments(prev => ({ ...prev, 'jee-main': result.id || 'local-jee-main' }));
      setActiveTab('recommendations');
      toast.success("JEE Main assessment completed! Al-Naseeh is analyzing your engineering options...");
    } catch (error) {
      console.error('Error submitting JEE Main assessment:', error);
      toast.error("Failed to save assessment. Please try again.");
    }
  };

  const handleJEEAdvancedSubmit = async (data: any) => {
    try {
      const result = await saveAssessment.mutateAsync({
        examName: 'jee-advanced',
        examYear: '2025',
        marks: data.jeeAdvancedRank,
        totalMarks: '50000',
        category: data.category,
        gender: data.gender,
        domicileState: 'all-india',
        preferredStates: [],
        budgetRange: data.budgetRange,
        hostOrDay: data.hostelPreference,
        religiousPractices: '',
        specialNeeds: '',
        collegeType: 'iit',
        climatePreference: 'no-preference',
        languagePreference: data.languagePreference,
        additionalInfo: data.additionalInfo
      });
      
      setAssessmentData(prev => ({ ...prev, 'jee-advanced': data }));
      setSubmittedAssessments(prev => ({ ...prev, 'jee-advanced': result.id || 'local-jee-advanced' }));
      setActiveTab('recommendations');
      toast.success("JEE Advanced assessment completed! Al-Naseeh is analyzing your IIT options...");
    } catch (error) {
      console.error('Error submitting JEE Advanced assessment:', error);
      toast.error("Failed to save assessment. Please try again.");
    }
  };

  const resetSession = () => {
    clearLocalData();
    setAssessmentData({});
    setSelectedExams([]);
    setActiveExamTab('');
    setSubmittedAssessments({});
    setActiveTab('assessment');
    toast.success("Session reset successfully!");
  };

  const handleConversationalData = (extractedData: any) => {
    // Pre-fill form data based on conversational input
    const currentExamData = {
      ...assessmentData[activeExamTab],
      ...extractedData
    };
    
    setAssessmentData(prev => ({
      ...prev,
      [activeExamTab]: currentExamData
    }));
    
    // Switch back to form mode with pre-filled data
    setShowConversationalMode(false);
    toast.success("Data extracted from conversation! Please review and complete the form.");
  };

  const renderAssessmentForm = () => {
    if (showConversationalMode) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Chat with Al-Naseeh الناصح</h3>
            <Button 
              variant="outline" 
              onClick={() => setShowConversationalMode(false)}
            >
              Switch to Form
            </Button>
          </div>
          <IntelligentChatAI 
            onDataExtracted={handleConversationalData}
            examType={activeExamTab.replace('-', ' ').toUpperCase()}
            studentProfile={assessmentData[activeExamTab]}
          />
        </div>
      );
    }

    switch (activeExamTab) {
      case 'neet-ug':
        return (
          <NEETAssessmentForm 
            onSubmit={handleNEETSubmit}
            isSubmitting={saveAssessment.isPending}
          />
        );
      case 'jee-main':
        return (
          <JEEMainAssessmentForm 
            onSubmit={handleJEEMainSubmit}
            isSubmitting={saveAssessment.isPending}
          />
        );
      case 'jee-advanced':
        return (
          <JEEAdvancedAssessmentForm 
            onSubmit={handleJEEAdvancedSubmit}
            isSubmitting={saveAssessment.isPending}
          />
        );
      default:
        return (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">Please select an exam to begin assessment</p>
              <Button onClick={() => setSelectedExams([])}>
                Choose Exam
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  const renderRecommendations = () => {
    const currentAssessmentData = assessmentData[activeExamTab];
    const currentAssessmentId = submittedAssessments[activeExamTab];
    
    if (!currentAssessmentData || !currentAssessmentId) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Complete your assessment first to see personalized recommendations</p>
            <Button onClick={() => setActiveTab('assessment')}>
              Go to Assessment
            </Button>
          </CardContent>
        </Card>
      );
    }

    switch (activeExamTab) {
      case 'neet-ug':
        return <NEETRecommendations assessmentData={currentAssessmentData} />;
      case 'jee-main':
      case 'jee-advanced':
        return <AIRecommendations assessmentId={currentAssessmentId} />;
      default:
        return null;
    }
  };

  if (selectedExams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <ExamSelectionGateway 
            onExamSelect={handleExamSelect}
            selectedExams={selectedExams}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex justify-between items-center mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🤖 Al-Naseeh - الناصح</h1>
              <p className="text-gray-600 mt-2">
                Your honest AI advisor for college counseling with real-time 2025 data
              </p>
            </div>
            <div className="flex gap-2">
              {!user && (
                <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                  Sign In (Optional)
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={resetSession}>
                <RotateCcw className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>
          </div>
        </div>

        {/* Exam Selection Tabs */}
        {selectedExams.length > 1 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {selectedExams.map(exam => (
                <Button
                  key={exam}
                  variant={activeExamTab === exam ? "default" : "outline"}
                  onClick={() => setActiveExamTab(exam)}
                  className="capitalize"
                >
                  {exam === 'neet-ug' && '🩺 NEET UG'}
                  {exam === 'jee-main' && '⚙️ JEE Main'}
                  {exam === 'jee-advanced' && '⚡ JEE Advanced'}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="tracker">Live Tracker</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowConversationalMode(!showConversationalMode)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0"
              >
                {showConversationalMode ? "📝 Switch to Form" : "🤖 AI Chat Mode"}
              </Button>
            </div>
            {renderAssessmentForm()}
          </TabsContent>

          <TabsContent value="recommendations">
            {renderRecommendations()}
          </TabsContent>

          <TabsContent value="safety">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🛡️ Cultural & Safety Assessment</h2>
                <p className="text-gray-600">Detailed safety analysis for peace of mind</p>
              </div>
              
              {submittedAssessments[activeExamTab] ? (
                <div className="grid gap-6">
                  <CulturalSafetyScore 
                    collegeId="sample-college-1"
                    collegeName="AIIMS Delhi"
                  />
                  <CulturalSafetyScore 
                    collegeId="sample-college-2"
                    collegeName="JIPMER Puducherry"
                  />
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 mb-4">Complete your assessment first to see safety scores</p>
                    <Button onClick={() => setActiveTab('assessment')}>
                      Go to Assessment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tracker">
            <CounselingTracker />
          </TabsContent>

          <TabsContent value="timeline">
            <AdmissionTimeline />
          </TabsContent>

          <TabsContent value="alerts">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🔔 Smart Alerts & Notifications</h2>
                <p className="text-gray-600">Never miss important counseling updates</p>
              </div>
              
              <AlertSystem studentProfile={assessmentData[activeExamTab]} />
            </div>
          </TabsContent>

          <TabsContent value="simulation">
            <SimulationMode />
          </TabsContent>

          <TabsContent value="export">
            <div className="space-y-6">
              <ExportRecommendations 
                recommendations={[]}
                assessmentData={assessmentData[activeExamTab]}
              />
              
              <ParentReport 
                recommendations={[]}
                studentData={assessmentData[activeExamTab]}
              />
            </div>
          </TabsContent>
        </Tabs>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    </div>
  );
};

export default Assessment;
