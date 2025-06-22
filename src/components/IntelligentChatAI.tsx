import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, MicOff, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface ExtractedData {
  neetScore?: string;
  category?: string;
  domicileState?: string;
  gender?: string;
  [key: string]: unknown;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  data?: ExtractedData;
  suggestions?: string[];
}

interface IntelligentChatAIProps {
  onDataExtracted: (data: ExtractedData) => void;
  examType: string;
  studentProfile?: {
    name?: string;
    category?: string;
    state?: string;
    [key: string]: unknown;
  };
}

export const IntelligentChatAI = ({ onDataExtracted, examType, studentProfile }: IntelligentChatAIProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `السلام علیکم! I'm Al-Naseeh (الناصح), your honest AI advisor.

Tell me about your ${examType} performance and preferences in natural language - I'll understand Hindi, Urdu, or English!

Examples:
• "Mujhe 550 marks mile hain NEET mein, OBC category, Bihar se hun - government college mil sakta hai?"
• "My daughter got 85 percentile in JEE Main, we need low-cost options with hostel"
• "کیا 480 marks میں BDS کا chance ہے؟ Muslim family ہیں، hijab friendly chahiye"`,
      timestamp: new Date(),
      suggestions: [
        "Tell me your NEET score and category",
        "میرے marks کے ساتھ کون سا کالج مل سکتا ہے؟",
        "Show me government college options",
        "Need hijab-friendly colleges with hostel"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN'; // Support Hindi/Urdu

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        toast.success("Voice input captured!");
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Voice input failed. Please try typing instead.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  const speakText = (text: string) => {
    if (speechSynthesisRef.current && !isSpeaking) {
      // Clean text for speech (remove emojis and special characters)
      const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').replace(/\n/g, '. ');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesisRef.current.speak(utterance);
    } else if (isSpeaking) {
      speechSynthesisRef.current?.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      toast.error("Voice input not supported in this browser");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processIntelligentQuery = async (query: string) => {
    // Advanced NLP processing to extract student data
    const patterns = {
      neetScore: /(\d{3,4})\s*(?:marks?|number|score)\s*(?:mile|mila|hai|in|got)?/i,
      category: /(general|gen|obc|sc|st|ews|pwd|minority|muslim)/i,
      state: /(bihar|up|uttar pradesh|mp|madhya pradesh|rajasthan|punjab|haryana|gujarat|maharashtra|karnataka|tamil nadu|kerala|telangana|andhra pradesh|west bengal|bengal|odisha|jharkhand|chhattisgarh|uttarakhand|himachal|delhi|mumbai|chennai|kolkata|bangalore|hyderabad)/i,
      gender: /(girl|boy|female|male|daughter|son|beta|beti|लड़की|لڑکی)/i,
      budget: /(low[- ]?cost|budget|free|government|govt|private|expensive|सस्ता|مفت)/i,
      hostel: /(hostel|accommodation|رہائش|छात्रावास)/i,
      hijab: /(hijab|islamic|muslim|cultural|ہجاب|حجاب)/i,
      course: /(mbbs|bds|bams|bhms|bums|veterinary|nursing|physiotherapy)/i
    };

    const extractedData: ExtractedData = {};
    let responseContext = '';

    // Extract NEET score
    const scoreMatch = query.match(patterns.neetScore);
    if (scoreMatch) {
      extractedData.neetScore = scoreMatch[1];
      responseContext += `With ${scoreMatch[1]} marks, `;
    }

    // Extract category
    const categoryMatch = query.match(patterns.category);
    if (categoryMatch) {
      const cat = categoryMatch[1].toLowerCase();
      extractedData.category = cat === 'gen' ? 'general' : cat;
      responseContext += `under ${extractedData.category.toUpperCase()} category, `;
    }

    // Extract state
    const stateMatch = query.match(patterns.state);
    if (stateMatch) {
      extractedData.domicileState = stateMatch[1].toLowerCase().replace(' pradesh', '-pradesh');
      responseContext += `from ${stateMatch[1]}, `;
    }

    // Extract gender
    const genderMatch = query.match(patterns.gender);
    if (genderMatch) {
      const g = genderMatch[1].toLowerCase();
      extractedData.gender = g.includes('girl') || g.includes('daughter') || g.includes('female') || g.includes('beti') || g.includes('لڑکی') ? 'female' : 'male';
    }

    // Detect preferences
    const preferences = [];
    if (patterns.budget.test(query)) preferences.push('budget-conscious');
    if (patterns.hostel.test(query)) preferences.push('hostel-required');
    if (patterns.hijab.test(query)) preferences.push('hijab-friendly');

    // Generate intelligent response based on extracted data
    let aiResponse = '';
    
    if (Object.keys(extractedData).length > 0) {
      aiResponse = `جی ہاں! I understand your query. ${responseContext}here's my analysis:\n\n`;
      
      if (extractedData.neetScore) {
        const score = parseInt(extractedData.neetScore);
        
        if (score >= 600) {
          aiResponse += `🎯 **Excellent Score!** You have strong chances for:\n`;
          aiResponse += `• Government medical colleges in your state\n`;
          aiResponse += `• AIIMS if above 650 (depending on category)\n`;
          aiResponse += `• Top private colleges as backup\n\n`;
        } else if (score >= 500) {
          aiResponse += `🎯 **Good Score!** You can expect:\n`;
          aiResponse += `• State government colleges (Round 2/Mop-up)\n`;
          aiResponse += `• Semi-government colleges\n`;
          aiResponse += `• Quality private colleges\n\n`;
        } else if (score >= 400) {
          aiResponse += `🎯 **Moderate Score** - Don't worry! Options include:\n`;
          aiResponse += `• BDS in government colleges\n`;
          aiResponse += `• BAMS/BHMS colleges\n`;
          aiResponse += `• Private MBBS (higher fees)\n\n`;
        }

        // Add category-specific guidance
        if (extractedData.category === 'obc') {
          aiResponse += `✅ **OBC Category Benefits:**\n`;
          aiResponse += `• 27% reservation in government seats\n`;
          aiResponse += `• Lower cutoffs compared to general category\n`;
          aiResponse += `• Fee reimbursement schemes available\n\n`;
        }

        // Add state-specific information
        if (extractedData.domicileState) {
          aiResponse += `📍 **${extractedData.domicileState.toUpperCase()} State Quota:**\n`;
          aiResponse += `• 85% seats reserved for state domicile\n`;
          aiResponse += `• Lower competition than All India Quota\n`;
          aiResponse += `• Apply for both AIQ and state counseling\n\n`;
        }

        // Add cultural considerations
        if (preferences.includes('hijab-friendly')) {
          aiResponse += `🧕 **Cultural Considerations:**\n`;
          aiResponse += `• Looking for hijab-friendly environment\n`;
          aiResponse += `• Female hostels with Islamic dietary options\n`;
          aiResponse += `• Colleges with diverse cultural acceptance\n\n`;
        }
      }

      aiResponse += `💬 Would you like me to:\n`;
      aiResponse += `• Show specific college recommendations?\n`;
      aiResponse += `• Explain the counseling process step-by-step?\n`;
      aiResponse += `• Create a personalized documents checklist?\n`;
      aiResponse += `• Set up WhatsApp alerts for counseling updates?`;

      // Pass extracted data to parent component
      onDataExtracted(extractedData);
    } else {
      aiResponse = `I understand you're looking for guidance! Let me help you better. Could you share:\n\n`;
      aiResponse += `📊 Your NEET score/rank\n`;
      aiResponse += `📋 Category (General/OBC/SC/ST)\n`;
      aiResponse += `📍 Your home state\n`;
      aiResponse += `💰 Budget preference (Government/Private)\n`;
      aiResponse += `🏠 Any specific requirements (hostel, cultural, etc.)\n\n`;
      aiResponse += `Example: "میں نے NEET میں 520 marks پائے ہیں، OBC category، UP سے ہوں، government college چاہیے hostel کے ساتھ"`;
    }

    return {
      response: aiResponse,
      extractedData,
      suggestions: [
        "Show me college options",
        "Explain counseling rounds",
        "Documents checklist بنائیں",
        "Government vs Private comparison"
      ]
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Process the query intelligently
      const result = await processIntelligentQuery(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.response,
        timestamp: new Date(),
        data: result.extractedData,
        suggestions: result.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Optionally speak the response
      if (result.response.length < 500) {
        speakText(result.response);
      }
      
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "معذرت! I encountered an issue processing your query. Please try again or rephrase your question.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }

    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Al-Naseeh الناصح - Intelligent Assistant
          <Badge variant="secondary" className="ml-auto">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm whitespace-pre-line flex-1">{message.content}</p>
                        {message.type === 'ai' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(message.content)}
                            className="h-6 w-6 p-0 hover:bg-gray-200"
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3 h-3" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && message.type === 'ai' && (
                  <div className="flex flex-wrap gap-2 ml-12">
                    {message.suggestions.map((suggestion, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 text-xs"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask in Hindi, Urdu, or English... / सवाल पूछें / سوال کریں"
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={isListening ? stopListening : startListening}
              className={isListening ? 'bg-red-100 border-red-300' : ''}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-red-600" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
            <Button onClick={handleSend} disabled={!input.trim() || isProcessing}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Supports Hindi, Urdu & English • Voice input enabled • Real-time AI processing
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
