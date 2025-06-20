import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Users, Settings, MessageCircle, Download, Zap, Globe } from 'lucide-react';
import { toast } from 'sonner';

// Component imports
import { NEETAssessmentForm } from '@/components/NEETAssessmentForm';
import { JEEMainAssessmentForm } from '@/components/JEEMainAssessmentForm';
import { JEEAdvancedAssessmentForm } from '@/components/JEEAdvancedAssessmentForm';
import { AIRecommendations } from '@/components/AIRecommendations';
import { NEETRecommendations } from '@/components/NEETRecommendations';
import { ParentReport } from '@/components/ParentReport';
import { IntelligentChatAI } from '@/components/IntelligentChatAI';
import { VoiceAIChat } from '@/components/VoiceAIChat';
import { EnhancedExportSystem } from '@/components/EnhancedExportSystem';
import { CollegeComparisonBot } from '@/components/CollegeComparisonBot';
import { JEESpecificModules } from '@/components/JEESpecificModules';
import { AlertSystem } from '@/components/AlertSystem';

// Services
import { aiService } from '@/services/aiService';
import { realtimeDataService } from '@/services/realtimeDataService';

// Hooks
import { useUrduFonts } from '@/hooks/useUrduFonts';

interface AssessmentProps {
  session: any;
}

const Assessment: React.FC<AssessmentProps> = ({ session }) => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'ur'>('en');
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [aiRecommendations, setAIRecommendations] = useState<any[]>([]);
  const [neetRecommendations, setNEETRecommendations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('ai-assessment');

  useUrduFonts(language);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage') as 'en' | 'hi' | 'ur' || 'en';
    setLanguage(storedLanguage);
  }, []);

  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'ur') => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  const handleProfileUpdate = async (profileData: any) => {
    setStudentProfile(profileData);
    try {
      const recommendations = await aiService.getRecommendations(profileData);
      setAIRecommendations(recommendations);
      toast.success('AI Recommendations generated successfully!');
    } catch (error: any) {
      console.error('Error fetching AI recommendations:', error);
      toast.error('Failed to generate AI recommendations. Please try again.');
    }
  };

  const handleNEETRecommendations = (recommendations: any[]) => {
    setNEETRecommendations(recommendations);
  };

  return (
    <div className={`min-h-screen py-10 ${language === 'ur' ? 'font-urdu' : ''}`}>
      <div className="container mx-auto px-4 space-y-6">

        {/* Language Selection Pills */}
        <div className="flex justify-center gap-2">
          <Badge
            variant={language === 'en' ? 'default' : 'outline'}
            onClick={() => handleLanguageChange('en')}
            className="cursor-pointer"
          >
            English
          </Badge>
          <Badge
            variant={language === 'hi' ? 'default' : 'outline'}
            onClick={() => handleLanguageChange('hi')}
            className="cursor-pointer"
          >
            हिंदी
          </Badge>
          <Badge
            variant={language === 'ur' ? 'default' : 'outline'}
            onClick={() => handleLanguageChange('ur')}
            className="cursor-pointer"
          >
            اردو
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <GraduationCap className="w-6 h-6" />
              {language === 'en' ? 'Al-Naseeh AI Counseling' : (language === 'hi' ? 'अल- नसीह एआई काउंसलिंग' : 'النصیح AI مشاورت')}
              {language === 'ur' && <span className="text-sm">- آپ کا ایماندار AI مشیر</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="justify-center">
                <TabsTrigger value="ai-assessment" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {language === 'en' ? 'AI Assessment' : (language === 'hi' ? 'एआई आकलन' : 'اے آئی کی تشخیص')}
                </TabsTrigger>
                <TabsTrigger value="neet-assessment" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {language === 'en' ? 'NEET Assessment' : (language === 'hi' ? 'नीट आकलन' : 'نیٹ تشخیص')}
                </TabsTrigger>
                <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {language === 'en' ? 'AI Recommendations' : (language === 'hi' ? 'एआई सिफारिशें' : 'اے آئی کی سفارشات')}
                </TabsTrigger>
                <TabsTrigger value="neet-recommendations" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {language === 'en' ? 'NEET Recommendations' : (language === 'hi' ? 'नीट सिफारिशें' : 'نیٹ سفارشات')}
                </TabsTrigger>
                <TabsTrigger value="parent-report" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {language === 'en' ? 'Parent Report' : (language === 'hi' ? 'माता-पिता की रिपोर्ट' : 'والدین کی رپورٹ')}
                </TabsTrigger>
                <TabsTrigger value="ai-chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {language === 'en' ? 'AI Chat' : (language === 'hi' ? 'एआई चैट' : 'اے آئی چیٹ')}
                </TabsTrigger>
                <TabsTrigger value="voice-ai-chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {language === 'en' ? 'Voice AI Chat' : (language === 'hi' ? 'वॉयस एआई चैट' : 'وائس اے آئی چیٹ')}
                </TabsTrigger>
                <TabsTrigger value="export-system" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  {language === 'en' ? 'Export System' : (language === 'hi' ? 'निर्यात प्रणाली' : 'برآمدی نظام')}
                </TabsTrigger>
                <TabsTrigger value="college-comparison" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  {language === 'en' ? 'College Comparison' : (language === 'hi' ? 'कॉलेज तुलना' : 'کالج کا موازنہ')}
                </TabsTrigger>
                <TabsTrigger value="jee-modules" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {language === 'en' ? 'JEE Modules' : (language === 'hi' ? 'जेईई मॉड्यूल' : 'جے ای ای ماڈیولز')}
                </TabsTrigger>
                <TabsTrigger value="alert-system" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  {language === 'en' ? 'Alert System' : (language === 'hi' ? 'अलर्ट सिस्टम' : 'الرٹ سسٹم')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai-assessment" className="outline-none">
                <div className="grid md:grid-cols-2 gap-4">
                  <NEETAssessmentForm onSubmit={handleProfileUpdate} language={language} />
                  <JEEMainAssessmentForm onSubmit={handleProfileUpdate} language={language} />
                  <JEEAdvancedAssessmentForm onSubmit={handleProfileUpdate} language={language} />
                </div>
              </TabsContent>

              <TabsContent value="neet-assessment" className="outline-none">
                <NEETAssessmentForm onSubmit={handleProfileUpdate} language={language} />
              </TabsContent>

              <TabsContent value="ai-recommendations" className="outline-none">
                <AIRecommendations recommendations={aiRecommendations} language={language} />
              </TabsContent>

              <TabsContent value="neet-recommendations" className="outline-none">
                <NEETRecommendations onRecommendations={handleNEETRecommendations} language={language} />
              </TabsContent>

              <TabsContent value="parent-report" className="outline-none">
                <ParentReport studentProfile={studentProfile} aiRecommendations={aiRecommendations} language={language} />
              </TabsContent>

              <TabsContent value="ai-chat" className="outline-none">
                <IntelligentChatAI language={language} />
              </TabsContent>

              <TabsContent value="voice-ai-chat" className="outline-none">
                <VoiceAIChat language={language} />
              </TabsContent>

              <TabsContent value="export-system" className="outline-none">
                <EnhancedExportSystem data={aiRecommendations} studentProfile={studentProfile} language={language} />
              </TabsContent>

              <TabsContent value="college-comparison" className="outline-none">
                <CollegeComparisonBot />
              </TabsContent>

              <TabsContent value="jee-modules" className="outline-none">
                <JEESpecificModules language={language} />
              </TabsContent>
              
              <TabsContent value="alert-system" className="outline-none">
                <AlertSystem language={language} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          {language === 'en' ? 'Powered by Al-Naseeh AI' : (language === 'hi' ? 'अल- नसीह एआई द्वारा संचालित' : 'النصیح AI کے ذریعے تقویت یافتہ')}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
