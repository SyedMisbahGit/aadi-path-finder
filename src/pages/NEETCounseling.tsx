
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Stethoscope, FileText, Search, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// NEET Components
import { NEETProfileForm } from '@/components/neet/NEETProfileForm';
import { NEETCollegePredictor } from '@/components/neet/NEETCollegePredictor';
import { NEETSeatMatrix } from '@/components/neet/NEETSeatMatrix';
import { NEETDocumentChecker } from '@/components/neet/NEETDocumentChecker';
import { NEETCounselingTimeline } from '@/components/neet/NEETCounselingTimeline';
import { NEETParentMode } from '@/components/neet/NEETParentMode';

// Services
import type { NEETProfile } from '@/types/neet';

const NEETCounseling = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'hi' | 'ur'>('en');
  const [parentMode, setParentMode] = useState(false);
  const [studentProfile, setStudentProfile] = useState<NEETProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage') as 'en' | 'hi' | 'ur' || 'en';
    const storedParentMode = localStorage.getItem('parentMode') === 'true';
    setLanguage(storedLanguage);
    setParentMode(storedParentMode);
  }, []);

  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'ur') => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  const handleParentModeToggle = () => {
    const newParentMode = !parentMode;
    setParentMode(newParentMode);
    localStorage.setItem('parentMode', newParentMode.toString());
  };

  const handleProfileUpdate = (profileData: NEETProfile) => {
    setStudentProfile(profileData);
    localStorage.setItem('neetProfile', JSON.stringify(profileData));
    toast.success('Profile updated successfully!');
    setActiveTab('predictor');
  };

  if (parentMode) {
    return (
      <NEETParentMode 
        onToggleParentMode={handleParentModeToggle}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
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
            
            {/* Parent Mode Toggle */}
            <Button
              variant="outline"
              onClick={handleParentModeToggle}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Parent Mode
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-green-600" />
              NEET UG Counseling
              {language === 'ur' && <span className="text-lg">- میڈیکل کالج رہنمائی</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
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
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="parent-mode" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Parent View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="outline-none">
                <NEETProfileForm 
                  onSubmit={handleProfileUpdate} 
                  language={language}
                  initialData={studentProfile}
                />
              </TabsContent>

              <TabsContent value="predictor" className="outline-none">
                <NEETCollegePredictor 
                  profile={studentProfile}
                  language={language}
                />
              </TabsContent>

              <TabsContent value="seat-matrix" className="outline-none">
                <NEETSeatMatrix 
                  profile={studentProfile}
                  language={language}
                />
              </TabsContent>

              <TabsContent value="documents" className="outline-none">
                <NEETDocumentChecker 
                  profile={studentProfile}
                  language={language}
                />
              </TabsContent>

              <TabsContent value="timeline" className="outline-none">
                <NEETCounselingTimeline language={language} />
              </TabsContent>

              <TabsContent value="parent-mode" className="outline-none">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'en' ? 'Switch to Parent Mode' : 
                     language === 'hi' ? 'पैरेंट मोड में स्विच करें' : 
                     'والدین موڈ میں تبدیل کریں'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'en' ? 'Simplified interface for parents with key information' : 
                     language === 'hi' ? 'माता-पिता के लिए सरल इंटरफ़ेस' : 
                     'والدین کے لیے آسان انٹرفیس'}
                  </p>
                  <Button onClick={handleParentModeToggle}>
                    {language === 'en' ? 'Switch to Parent Mode' : 
                     language === 'hi' ? 'पैरेंट मोड चालू करें' : 
                     'والدین موڈ شروع کریں'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          {language === 'en' ? 'Powered by Al-Naseeh AI for NEET UG Counseling' : 
           language === 'hi' ? 'अल-नसीह एआई द्वारा संचालित नीट परामर्श' : 
           'النصیح AI کے ذریعے نیٹ کی رہنمائی'}
        </div>
      </div>
    </div>
  );
};

export default NEETCounseling;
