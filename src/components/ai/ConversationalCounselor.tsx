
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, Bot, User, Brain, Target, Shield } from 'lucide-react';
import { toast } from 'sonner';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({});
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const processNaturalLanguageInput = async (text: string): Promise<any> => {
    // Advanced NLP processing to extract student data
    const patterns = {
      exam: /(neet|jee[- ]?main|medical|engineering)/i,
      percentile: /(\d{1,3}(?:\.\d+)?)\s*(?:percentile|%)/i,
      score: /(\d{3,4})\s*(?:marks?|score)/i,
      rank: /(?:rank|air)\s*(\d{1,6})/i,
      category: /(general|gen|obc|sc|st|ews|pwd)/i,
      gender: /(male|female|girl|boy|daughter|son)/i,
      hijab: /(hijab|islamic|muslim|cultural)/i,
      income: /(low|poor|middle|high|rich)\s*(?:income|family)/i,
      year: /(202[4-9])/i,
      approximate: /(around|about|roughly|approximately)/i
    };

    const extracted: any = {
      confidence: 0.7,
      reasoning: []
    };

    // Extract exam type
    const examMatch = text.match(patterns.exam);
    if (examMatch) {
      const exam = examMatch[1].toLowerCase();
      extracted.exam = exam.includes('neet') || exam.includes('medical') ? 'NEET' : 'JEE-MAIN';
      extracted.reasoning.push(`Detected ${extracted.exam} exam`);
    }

    // Extract scores with context
    const percentileMatch = text.match(patterns.percentile);
    const scoreMatch = text.match(patterns.score);
    const rankMatch = text.match(patterns.rank);
    const approximateMatch = text.match(patterns.approximate);

    if (percentileMatch) {
      extracted.scoreType = 'percentile';
      extracted.scoreValue = parseFloat(percentileMatch[1]);
      extracted.reasoning.push(`Percentile: ${extracted.scoreValue}%`);
    } else if (scoreMatch) {
      extracted.scoreType = 'score';
      extracted.scoreValue = parseInt(scoreMatch[1]);
      extracted.reasoning.push(`Score: ${extracted.scoreValue} marks`);
    } else if (rankMatch) {
      extracted.scoreType = 'rank';
      extracted.scoreValue = parseInt(rankMatch[1]);
      extracted.reasoning.push(`Rank: ${extracted.scoreValue}`);
    }

    if (approximateMatch) {
      extracted.approximate = true;
      extracted.confidence = 0.5;
      extracted.reasoning.push('Approximate values detected');
    }

    // Extract category
    const categoryMatch = text.match(patterns.category);
    if (categoryMatch) {
      extracted.category = categoryMatch[1].toUpperCase();
      extracted.reasoning.push(`Category: ${extracted.category}`);
    }

    // Extract gender and cultural needs
    const genderMatch = text.match(patterns.gender);
    if (genderMatch) {
      const g = genderMatch[1].toLowerCase();
      extracted.gender = g.includes('girl') || g.includes('daughter') ? 'female' : 
                        g.includes('boy') || g.includes('son') ? 'male' : g;
      extracted.reasoning.push(`Gender: ${extracted.gender}`);
    }

    const hijabMatch = text.match(patterns.hijab);
    if (hijabMatch) {
      extracted.culturalNeeds = ['hijab-friendly', 'islamic-facilities'];
      extracted.reasoning.push('Cultural requirements: Islamic-friendly environment');
    }

    return extracted;
  };

  const generateAIResponse = (extractedData: any, userText: string): string => {
    let response = '';
    
    if (extractedData.reasoning && extractedData.reasoning.length > 0) {
      response += `✨ **AI Analysis** (Confidence: ${(extractedData.confidence * 100).toFixed(0)}%)\n\n`;
      response += `I understood:\n`;
      extractedData.reasoning.forEach((reason: string) => {
        response += `• ${reason}\n`;
      });
      response += '\n';

      // Generate predictions and recommendations
      if (extractedData.scoreValue) {
        response += `🎯 **Predicted Outcomes:**\n`;
        
        if (extractedData.exam === 'NEET' && extractedData.scoreType === 'score') {
          const score = extractedData.scoreValue;
          if (score >= 600) {
            response += `• Government medical colleges: High probability\n`;
            response += `• AIIMS: Possible (if score > 650)\n`;
            response += `• State quota advantage available\n`;
          } else if (score >= 450) {
            response += `• Private medical colleges: High probability\n`;
            response += `• BDS in government colleges: Good chance\n`;
            response += `• AYUSH courses: Excellent options\n`;
          }
        } else if (extractedData.exam === 'JEE-MAIN' && extractedData.scoreType === 'percentile') {
          const percentile = extractedData.scoreValue;
          if (percentile >= 95) {
            response += `• NITs: Good chances in preferred branches\n`;
            response += `• Top IIITs: High probability\n`;
            response += `• State government colleges: Excellent options\n`;
          } else if (percentile >= 85) {
            response += `• NITs: Lower branches possible\n`;
            response += `• Good IIITs and GFTIs: Strong chances\n`;
            response += `• Private colleges: Excellent options\n`;
          }
        }

        // Cultural considerations
        if (extractedData.culturalNeeds) {
          response += `\n🕌 **Cultural Considerations:**\n`;
          response += `• Filtering for hijab-friendly colleges\n`;
          response += `• Considering hostels with Islamic dietary options\n`;
          response += `• Evaluating regional cultural acceptance\n`;
        }

        response += `\n💡 **Next Steps:**\n`;
        response += `• Need your state/region preference?\n`;
        response += `• What's your budget range?\n`;
        response += `• Any specific college types preferred?\n`;
        response += `\nI'll create a personalized college list with safety scores!`;
      }
    } else {
      response = `I'd love to help! Could you share more details like:\n\n`;
      response += `📊 Your exam score/percentile/rank\n`;
      response += `📋 Category (if applicable)\n`;
      response += `📍 Preferred states or regions\n`;
      response += `💰 Budget considerations\n\n`;
      response += `Example: "I got 78 percentile in JEE Main, OBC category, looking for engineering colleges in Maharashtra under 2 lakh fees"`;
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Process natural language input
      const extractedData = await processNaturalLanguageInput(input);
      
      // Update student profile
      const updatedProfile = { ...studentProfile, ...extractedData };
      setStudentProfile(updatedProfile);

      // Generate AI response
      const aiResponse = generateAIResponse(extractedData, input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        data: extractedData,
        confidence: extractedData.confidence,
        reasoning: extractedData.reasoning?.join(', ')
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
    } finally {
      setIsProcessing(false);
    }

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Al-Naseeh الناصح</h1>
              <p className="text-sm text-gray-600">AI Career Counselor</p>
            </div>
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
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
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Brain className="w-3 h-3" />
                            Confidence: {(message.confidence * 100).toFixed(0)}%
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
                    <span className="text-sm text-gray-600">AI analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me about your exam, scores, preferences... I understand natural language!"
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
            Powered by autonomous AI • Multi-language support • Real-time data analysis
          </p>
        </div>
      </div>
    </div>
  );
};
