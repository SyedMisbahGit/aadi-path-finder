
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, RotateCcw, Download, Map, Calendar, Calculator } from "lucide-react";
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
import { toast } from "sonner";

const Assessment = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submittedAssessmentId, setSubmittedAssessmentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('assessment');
  const [examType, setExamType] = useState<'neet' | 'jee' | null>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const { user } = useAuth();
  const { saveAssessment, clearLocalData, loadAssessmentFromLocal } = useAssessment();

  useState(() => {
    const savedAssessment = loadAssessmentFromLocal();
    if (savedAssessment && Object.keys(savedAssessment).length > 2) {
      setAssessmentData(savedAssessment);
      if (savedAssessment.examName) {
        setExamType(savedAssessment.examName.includes('neet') ? 'neet' : 'jee');
      }
      toast.info("Previous session data loaded");
    }
  });

  const handleNEETSubmit = async (data: any) => {
    try {
      setAssessmentData(data);
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
      
      setSubmittedAssessmentId(result.id || 'local-neet-assessment');
      setActiveTab('recommendations');
      toast.success("NEET assessment completed! Al-Naseeh is analyzing your options...");
    } catch (error) {
      console.error('Error submitting NEET assessment:', error);
      toast.error("Failed to save assessment. Please try again.");
    }
  };

  const resetSession = () => {
    clearLocalData();
    setAssessmentData(null);
    setExamType(null);
    setSubmittedAssessmentId(null);
    setActiveTab('assessment');
    toast.success("Session reset successfully!");
  };

  const ExamTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🤖 Welcome to Al-Naseeh</h2>
        <p className="text-gray-600 mb-6">Your honest AI advisor for medical and engineering college counseling</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
          onClick={() => setExamType('neet')}
        >
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              🩺 NEET 2025
            </CardTitle>
            <CardDescription>
              Medical & Dental College Counseling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• MBBS, BDS, AYUSH colleges</li>
              <li>• AIQ, State, Deemed university options</li>
              <li>• Real-time MCC counseling updates</li>
              <li>• NEET-specific quota calculations</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500"
          onClick={() => setExamType('jee')}
        >
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              ⚙️ JEE 2025
            </CardTitle>
            <CardDescription>
              Engineering College Counseling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• IIT, NIT, IIIT colleges</li>
              <li>• JoSAA counseling tracker</li>
              <li>• Branch and specialization guidance</li>
              <li>• State quota engineering options</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-sm text-blue-800">
          ✨ <strong>No signup required!</strong> Your data stays private and is stored locally on your device.
        </p>
      </div>
    </div>
  );

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

        {!examType ? (
          <ExamTypeSelection />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="tracker">Live Tracker</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="simulation">Simulation</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment" className="space-y-6">
              {examType === 'neet' ? (
                <NEETAssessmentForm 
                  onSubmit={handleNEETSubmit}
                  isSubmitting={saveAssessment.isPending}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 mb-4">JEE assessment form coming soon!</p>
                    <Button onClick={() => setExamType(null)}>
                      Choose Different Exam
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="recommendations">
              {submittedAssessmentId && assessmentData ? (
                examType === 'neet' ? (
                  <NEETRecommendations assessmentData={assessmentData} />
                ) : (
                  <AIRecommendations assessmentId={submittedAssessmentId} />
                )
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 mb-4">Complete your assessment first to see personalized recommendations</p>
                    <Button onClick={() => setActiveTab('assessment')}>
                      Go to Assessment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tracker">
              <CounselingTracker />
            </TabsContent>

            <TabsContent value="timeline">
              <AdmissionTimeline />
            </TabsContent>

            <TabsContent value="simulation">
              <SimulationMode />
            </TabsContent>

            <TabsContent value="export">
              <ExportRecommendations 
                recommendations={[]}
                assessmentData={assessmentData}
              />
            </TabsContent>
          </Tabs>
        )}

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    </div>
  );
};

export default Assessment;
