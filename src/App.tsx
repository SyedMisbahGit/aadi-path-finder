import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  GraduationCap, 
  Calculator, 
  FileText, 
  Users, 
  MapPin, 
  Star,
  Shield,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Share2,
  Settings,
  HelpCircle,
  BookOpen,
  Target,
  Calendar,
  FileCheck,
  Building,
  DollarSign,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Globe,
  Heart,
  Award,
  Clock,
  Bell,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Sun,
  Moon,
  Languages,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  RefreshCw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Home,
  LogOut,
  LogIn,
  UserPlus,
  Key,
  Lock,
  Unlock,
  MessageSquare,
  Video,
  Camera,
  Image,
  File,
  Folder,
  Archive,
  Tag,
  Hash,
  AtSign,
  Percent,
  CreditCard,
  Wallet,
  PiggyBank,
  TrendingDown
} from 'lucide-react';

// Import existing components
import Index from '@/pages/Index';
import NEETCounseling from '@/pages/NEETCounseling';
import JEECounseling from '@/pages/JEECounseling';
import AICounseling from '@/pages/AIConseling';
import NotFound from '@/pages/NotFound';

// Import hooks
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUrduFonts } from '@/hooks/useUrduFonts';

// Import services
import { supabase } from '@/integrations/supabase/client';

// Import types
import type { NEETProfile } from '@/types/neet';
import type { JEEProfile } from '@/types/jee';

import { pwaManager, isMobile } from '@/utils/pwa';

function App() {
  const [language, setLanguage] = useState<'en' | 'hi' | 'ur'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'neet' | 'jee' | 'ai' | 'v2'>('home');
  const [studentProfile, setStudentProfile] = useState<NEETProfile | JEEProfile | null>(null);
  const [aiSession, setAiSession] = useState<{
    id: string;
    startTime: string;
    extractedData: NEETProfile | JEEProfile | null;
    messages: Array<{
      role: 'user' | 'assistant';
      content: string;
      timestamp: string;
    }>;
  } | null>(null);
  const [showV2Features, setShowV2Features] = useState(false);

  const { user, signIn, signOut, loading } = useAuth();
  const isMobileDevice = isMobile();
  useUrduFonts(language);

  // Al-Naseeh V2 Features State
  const [v2Features] = useState({
    enhancedAI: true,
    inputValidation: true,
    confidenceScoring: true,
    culturalSensitivity: true,
    realTimeCorrections: true,
    comprehensiveDocuments: true,
    enhancedTimeline: true,
    seatMatrixPredictions: true,
    collegeInfoPanel: true,
    exportSystem: true,
    parentMode: true,
    multilingualSupport: true
  });

  const [pwaState, setPwaState] = useState(pwaManager.getState());
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  useEffect(() => {
    // Load user preferences
    const savedLanguage = localStorage.getItem('language') as 'en' | 'hi' | 'ur';
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) setTheme(savedTheme);
    
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Listen for PWA state changes
    const handleStateChange = (state: any) => {
      setPwaState(state);
    };

    pwaManager.on('stateChange', handleStateChange);
    pwaManager.on('updateAvailable', () => setShowUpdateBanner(true));

    // Register PWA features
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('[App] Service Worker ready:', registration);
      });
    }

    return () => {
      pwaManager.off('stateChange', handleStateChange);
    };
  }, [theme]);

  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'ur') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleDataExtracted = (data: NEETProfile | JEEProfile) => {
    setStudentProfile(data);
    setAiSession({
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      extractedData: data,
      messages: []
    });
  };

  const handleSignIn = () => {
    // For now, we'll use a simple approach - in production this would open a sign-in modal
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (email && password) {
      signIn(email, password).catch(console.error);
    }
  };

  const handleSignOut = () => {
    signOut().catch(console.error);
  };

  const getTranslation = (key: string) => {
    const translations = {
      app_title: { 
        en: 'Al-Naseeh V2 - AI College Counselor', 
        hi: 'अल-नसीह V2 - एआई कॉलेज काउंसलर', 
        ur: 'النصیح V2 - اے آئی کالج کاؤنسلر' 
      },
      welcome: { 
        en: 'Welcome to Al-Naseeh V2', 
        hi: 'अल-नसीह V2 में आपका स्वागत है', 
        ur: 'النصیح V2 میں آپ کا خیر مقدم ہے' 
      },
      enhanced_features: { 
        en: 'Enhanced Features', 
        hi: 'बेहतर सुविधाएं', 
        ur: 'بہتر خصوصیات' 
      },
      ai_counselor: { 
        en: 'AI Counselor', 
        hi: 'एआई काउंसलर', 
        ur: 'اے آئی کاؤنسلر' 
      },
      neet_counseling: { 
        en: 'NEET Counseling', 
        hi: 'नीट परामर्श', 
        ur: 'نیٹ کاؤنسلنگ' 
      },
      jee_counseling: { 
        en: 'JEE Counseling', 
        hi: 'जेईई परामर्श', 
        ur: 'جے ای ای کاؤنسلنگ' 
      },
      document_guide: { 
        en: 'Document Guide', 
        hi: 'दस्तावेज़ गाइड', 
        ur: 'دستاویز گائیڈ' 
      },
      timeline: { 
        en: 'Timeline', 
        hi: 'समय सारणी', 
        ur: 'ٹائم لائن' 
      },
      seat_matrix: { 
        en: 'Seat Matrix', 
        hi: 'सीट मैट्रिक्स', 
        ur: 'سیٹ میٹرکس' 
      },
      college_info: { 
        en: 'College Info', 
        hi: 'कॉलेज जानकारी', 
        ur: 'کالج کی معلومات' 
      },
      settings: { 
        en: 'Settings', 
        hi: 'सेटिंग्स', 
        ur: 'ترتیبات' 
      },
      help: { 
        en: 'Help', 
        hi: 'मदद', 
        ur: 'مدد' 
      },
      language: { 
        en: 'Language', 
        hi: 'भाषा', 
        ur: 'زبان' 
      },
      theme: { 
        en: 'Theme', 
        hi: 'थीम', 
        ur: 'تھیم' 
      },
      light: { 
        en: 'Light', 
        hi: 'हल्का', 
        ur: 'ہلکا' 
      },
      dark: { 
        en: 'Dark', 
        hi: 'गहरा', 
        ur: 'گہرا' 
      },
      english: { 
        en: 'English', 
        hi: 'अंग्रे़ी', 
        ur: 'انگریزی' 
      },
      hindi: { 
        en: 'Hindi', 
        hi: 'हिंदी', 
        ur: 'ہندی' 
      },
      urdu: { 
        en: 'Urdu', 
        hi: 'उर्दू', 
        ur: 'اردو' 
      },
      version: { 
        en: 'Version 2.0', 
        hi: 'संस्करण 2.0', 
        ur: 'ورژن 2.0' 
      },
      new_features: { 
        en: 'New Features', 
        hi: 'नई सुविधाएं', 
        ur: 'نئی خصوصیات' 
      },
      enhanced_ai: { 
        en: 'Enhanced AI with Input Validation', 
        hi: 'इनपुट वैलिडेशन के साथ बेहतर एआई', 
        ur: 'انپٹ ویلیڈیشن کے ساتھ بہتر اے آئی' 
      },
      confidence_scoring: { 
        en: 'Confidence Scoring', 
        hi: 'विश्वास स्कोरिंग', 
        ur: 'اعتماد اسکورنگ' 
      },
      cultural_sensitivity: { 
        en: 'Cultural Sensitivity', 
        hi: 'सांस्कृतिक संवेदनशीलता', 
        ur: 'ثقافتی حساسیت' 
      },
      real_time_corrections: { 
        en: 'Real-time Corrections', 
        hi: 'रीयल-टाइम सुधार', 
        ur: 'ریئل ٹائم درستگیاں' 
      },
      comprehensive_documents: { 
        en: 'Comprehensive Document Guide', 
        hi: 'व्यापक दस्तावेज़ गाइड', 
        ur: 'جامع دستاویز گائیڈ' 
      },
      enhanced_timeline: { 
        en: 'Enhanced Timeline', 
        hi: 'बेहतर समय सारणी', 
        ur: 'بہتر ٹائم لائن' 
      },
      seat_predictions: { 
        en: 'Seat Matrix Predictions', 
        hi: 'सीट मैट्रिक्स भविष्यवाणियां', 
        ur: 'سیٹ میٹرکس پیشن گوئیاں' 
      },
      college_panel: { 
        en: 'Enhanced College Info Panel', 
        hi: 'बेहतर कॉलेज जानकारी पैनल', 
        ur: 'بہتر کالج معلومات پینل' 
      },
      export_system: { 
        en: 'Enhanced Export System', 
        hi: 'बेहतर एक्सपोर्ट सिस्टम', 
        ur: 'بہتر ایکسپورٹ سسٹم' 
      },
      parent_mode: { 
        en: 'Parent-Friendly Mode', 
        hi: 'माता-पिता के अनुकूल मोड', 
        ur: 'والدین کے دوستانہ موڈ' 
      },
      multilingual: { 
        en: 'Enhanced Multilingual Support', 
        hi: 'बेहतर बहुभाषी समर्थन', 
        ur: 'بہتر کثیر لسانی مدد' 
      }
    };
    return translations[key as keyof typeof translations]?.[language] || key;
  };

  const renderV2Features = () => (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-600" />
                {getTranslation('app_title')}
                <Badge variant="secondary" className="ml-2">
                  {getTranslation('version')}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {getTranslation('welcome')} - Enhanced AI-powered college counseling system
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleThemeToggle}>
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Languages className="w-4 h-4" />
                {language.toUpperCase()}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            {getTranslation('new_features')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(v2Features).map(([key, enabled]) => (
              <div key={key} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div>
                  <div className="font-medium text-sm">
                    {getTranslation(key.replace(/([A-Z])/g, '_$1').toLowerCase())}
                  </div>
                  <div className="text-xs text-gray-500">
                    {enabled ? 'Active' : 'Coming Soon'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Features */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Counselor */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              {getTranslation('ai_counselor')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enhanced AI Counselor</h3>
              <p className="text-gray-600 mb-4">
                Advanced conversational AI with input validation, confidence scoring, and cultural sensitivity.
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Document Guide */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              {getTranslation('document_guide')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enhanced Document Guide</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive document checklists, downloadable templates, and state-wise variations.
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Timeline */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              {getTranslation('timeline')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enhanced Timeline</h3>
              <p className="text-gray-600 mb-4">
                Detailed counseling schedules, actionable tasks, and AI-generated checklists.
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Seat Matrix */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-orange-600" />
              {getTranslation('seat_matrix')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enhanced Seat Matrix</h3>
              <p className="text-gray-600 mb-4">
                Round-wise seat movement visualization and ML-based predictions.
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isMobileDevice ? 'block' : 'hidden lg:block lg:translate-x-0'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Al-Naseeh V2</h2>
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <nav className="p-4 space-y-2">
        <Button
          variant={currentView === 'home' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentView('home')}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        <Button
          variant={currentView === 'v2' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentView('v2')}
        >
          <Zap className="w-4 h-4 mr-2" />
          V2 Features
        </Button>
        <Button
          variant={currentView === 'neet' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentView('neet')}
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          NEET
        </Button>
        <Button
          variant={currentView === 'jee' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentView('jee')}
        >
          <Calculator className="w-4 h-4 mr-2" />
          JEE
        </Button>
        <Button
          variant={currentView === 'ai' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentView('ai')}
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Counselor
        </Button>
      </nav>
    </div>
  );

  const renderMainContent = () => {
    switch (currentView) {
      case 'v2':
        return renderV2Features();
      case 'neet':
        return <NEETCounseling />;
      case 'jee':
        return <JEECounseling />;
      case 'ai':
        return <AICounseling />;
      default:
        return <Index />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex">
        {/* Sidebar */}
        {renderSidebar()}
        
        {/* Main Content */}
        <div className={`flex-1 ${isMobileDevice ? 'w-full' : 'lg:ml-64'}`}>
          {/* Header */}
          <header className="bg-white dark:bg-gray-900 shadow-sm border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <h1 className="text-xl font-semibold">Al-Naseeh V2</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleThemeToggle}>
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <Languages className="w-4 h-4" />
                  {language.toUpperCase()}
                </Button>
                {user ? (
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleSignIn}>
                    <LogIn className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <main className="p-6">
            {renderMainContent()}
          </main>
        </div>
      </div>
      
      {/* Update Banner */}
      {showUpdateBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium">
                New version available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-gray-100"
              >
                Update
              </button>
              <button
                onClick={() => setShowUpdateBanner(false)}
                className="text-white hover:bg-blue-700 p-1 rounded"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
