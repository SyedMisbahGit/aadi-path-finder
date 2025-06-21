import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, Bot, User, Brain, Target, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MultilingualSupport } from './MultilingualSupport';
import { AIInsights } from './AIInsights';
import { useAIEngine } from '@/hooks/useAIEngine';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  data?: any;
  confidence?: number;
  reasoning?: string;
}

interface StudentProfile {
  exam?: 'NEET' | 'JEE-MAIN';
  year?: number;
  scoreType?: 'percentile' | 'rank' | 'approximate';
  scoreValue?: number;
  category?: string;
  gender?: 'male' | 'female' | 'other';
  income?: 'low' | 'middle' | 'high';
  culturalNeeds?: string[];
  statePreferences?: string[];
  budgetFlexibility?: 'strict' | 'moderate' | 'open';
  safetyPriority?: number;
}

export const ConversationalCounselor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `السلام علیکم! I'm Al-Naseeh (الناصح), your AI career counselor.

I'll help you find the perfect college based on your scores, background, and preferences. 

Just tell me naturally:
• "I got 85 percentile in JEE Main, OBC category"
• "NEET score around 550, don't know exact rank"
• "My daughter needs hijab-friendly college with hostel"

I understand incomplete information and will guide you through everything!`,
      timestamp: new Date(),
      confidence: 1.0
    }
  ]);

  const [input, setInput] = useState('');
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({});
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [safetyScores, setSafetyScores] = useState<any[]>([]);
  const [culturalFit, setCulturalFit] = useState<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use the enhanced AI engine
  const { 
    isProcessing, 
    aiInsights, 
    processWithAI, 
    getSafetyAnalysis,
    getMLPredictions,
    triggerDataCrawl 
  } = useAIEngine({ 
    language: currentLanguage,
    examType: studentProfile.exam
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Process with enhanced AI engine
      const result = await processWithAI(input, studentProfile);
      
      if (result.updatedProfile) {
        setStudentProfile(result.updatedProfile);
      }

      if (result.predictions) {
        setPredictions(result.predictions);
        
        // Get safety analysis for top predictions
        const topColleges = result.predictions.slice(0, 5);
        const safetyPromises = topColleges.map(pred => 
          getSafetyAnalysis(
            pred.college.name, 
            pred.college.location, 
            studentProfile.gender, 
            studentProfile.culturalNeeds
          )
        );
        
        const safetyResults = await Promise.all(safetyPromises);
        setSafetyScores(safetyResults.filter(Boolean).map((s, i) => ({
          college: topColleges[i].college.name,
          score: s.safetyAnalysis.overallScore
        })));
        
        // Set cultural fit from first result
        if (safetyResults[0]?.culturalAnalysis) {
          setCulturalFit(safetyResults[0].culturalAnalysis);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.response,
        timestamp: new Date(),
        data: result.extractedData,
        confidence: result.confidence,
        reasoning: result.extractedData.reasoning?.join(', ')
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('AI processing error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I encountered an issue processing your message. Could you rephrase or provide more specific details?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInput('');
  };

  const handleRefreshData = async () => {
    if (studentProfile.exam) {
      toast.info('Updating live counseling data...');
      await triggerDataCrawl(studentProfile.exam);
    } else {
      toast.info('Please specify your exam (NEET/JEE) first to update relevant data.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Set font family based on language
  const getFontFamily = (language: string) => {
    switch (language) {
      case 'hi':
        return 'font-devanagari'; // You'd need to add this to your CSS
      case 'ur':
        return 'font-nastaliq'; // Noto Nastaliq Urdu
      default:
        return 'font-sans';
    }
  };

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 ${getFontFamily(currentLanguage)}`}>
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Al-Naseeh الناصح</h1>
              <p className="text-sm text-gray-600">AI Career Counselor • Live Data • Cultural-Safe</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <MultilingualSupport 
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                disabled={isProcessing}
              >
                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {Object.keys(studentProfile).length} insights
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Dashboard */}
      {aiInsights && (
        <div className="bg-white border-b p-4">
          <div className="max-w-6xl mx-auto">
            <AIInsights 
              predictions={predictions}
              safetyScores={safetyScores}
              culturalFit={culturalFit}
              confidence={aiInsights.confidence}
            />
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-500' : 'bg-gradient-to-r from-green-500 to-teal-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white shadow-md border'
                    }`}>
                      <div className="whitespace-pre-line text-sm">{message.content}</div>
                      {message.confidence && message.type === 'ai' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Brain className="w-3 h-3" />
                            AI Confidence: {(message.confidence * 100).toFixed(0)}%
                            {message.reasoning && (
                              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                                {message.reasoning}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white shadow-md border p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI brain processing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Enhanced Input Area */}
        <div className="border-t bg-white p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  currentLanguage === 'hi' 
                    ? "अपनी परीक्षा, स्कोर, प्राथमिकताओं के बारे में बताएं..."
                    : currentLanguage === 'ur'
                    ? "اپنے امتحان، اسکور، ترجیحات کے بارے میں بتائیں..."
                    : "Tell me about your exam, scores, preferences... I understand natural language!"
                }
                className="w-full"
                disabled={isProcessing}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsListening(!isListening)}
              className={isListening ? 'bg-red-100 border-red-300' : ''}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-red-600' : ''}`} />
            </Button>
            <Button onClick={handleSend} disabled={!input.trim() || isProcessing}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Powered by autonomous AI • Multi-language support • Real-time data analysis • Cultural-safety aware
          </p>
        </div>
      </div>
    </div>
  );
};
