
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, FileText, Search, BarChart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// JEE Components
import { JEEProfileForm } from '@/components/jee/JEEProfileForm';
import { JEECollegePredictor } from '@/components/jee/JEECollegePredictor';
import { JEESeatMatrix } from '@/components/jee/JEESeatMatrix';
import { JEEBranchAnalyzer } from '@/components/jee/JEEBranchAnalyzer';
import { JEECollegeComparison } from '@/components/jee/JEECollegeComparison';

// Services
import type { JEEProfile } from '@/types/jee';

const JEECounseling = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'hi' | 'ur'>('en');
  const [studentProfile, setStudentProfile] = useState<JEEProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage') as 'en' | 'hi' | 'ur' || 'en';
    setLanguage(storedLanguage);
  }, []);

  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'ur') => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  const handleProfileUpdate = (profileData: JEEProfile) => {
    setStudentProfile(profileData);
    localStorage.setItem('jeeProfile', JSON.stringify(profileData));
    toast.success('Profile updated successfully!');
    setActiveTab('predictor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-4">
            {/* Language Selection */}
            <div className="flex gap-2">
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
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <Calculator className="w-8 h-8 text-blue-600" />
              JEE Main Counseling
              {language === 'ur' && <span className="text-lg">- انجینئرنگ کالج رہنمائی</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="predictor" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Predictor
                </TabsTrigger>
                <TabsTrigger value="seat-matrix" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Seat Matrix
                </TabsTrigger>
                <TabsTrigger value="branch-analyzer" className="flex items-center gap-2">
                  <BarChart className="w-4 h-4" />
                  Branch Analyzer
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Compare
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="outline-none">
                <JEEProfileForm 
                  onSubmit={handleProfileUpdate} 
                  language={language}
                  initialData={studentProfile}
                />
              </TabsContent>

              <TabsContent value="predictor" className="outline-none">
                <JEECollegePredictor 
                  profile={studentProfile}
                  language={language}
                />
              </TabsContent>

              <TabsContent value="seat-matrix" className="outline-none">
                <JEESeatMatrix 
                  profile={studentProfile}
                  language={language}
                />
              </TabsContent>

              <TabsContent value="branch-analyzer" className="outline-none">
                <JEEBranchAnalyzer 
                  profile={studentProfile}
                  language={language}
                />
              </TabsContent>

              <TabsContent value="comparison" className="outline-none">
                <JEECollegeComparison 
                  language={language}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          {language === 'en' ? 'Powered by Al-Naseeh AI for JEE Main Counseling' : 
           language === 'hi' ? 'अल-नसीह एआई द्वारा संचालित जेईई परामर्श' : 
           'النصیح AI کے ذریعے جے ای ای کی رہنمائی'}
        </div>
      </div>
    </div>
  );
};

export default JEECounseling;
