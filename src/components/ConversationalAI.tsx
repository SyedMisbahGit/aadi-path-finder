import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Send, Bot, User, MicOff } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ExtractedData {
  neetScore?: string;
  jeeMainPercentile?: string;
  rank?: string;
  category?: string;
  domicileState?: string;
  gender?: string;
}

interface ConversationalAIProps {
  onDataExtracted: (data: ExtractedData) => void;
  examType: string;
}

export const ConversationalAI = ({ onDataExtracted, examType }: ConversationalAIProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `سلام! I'm Al-Naseeh (الناصح), your honest advisor. Tell me about your ${examType} score and preferences, and I'll help find the best colleges for you! 

You can say something like: "I got 641 in NEET, OBC category, from Bihar - what are my best government college options?"`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
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
  }, []);

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

  const extractDataFromMessage = (message: string): ExtractedData => {
    // Simple pattern matching to extract common information
    const patterns = {
      neetScore: /(\d{3,4})\s*(?:in\s*)?neet/i,
      jeePercentile: /(\d{1,3}(?:\.\d+)?)\s*(?:percentile|%)/i,
      rank: /(?:rank|air)\s*(\d{1,6})/i,
      category: /(general|obc|sc|st|ews|pwd)/i,
      state: /(bihar|up|mp|rajasthan|punjab|haryana|gujarat|maharashtra|karnataka|tamil nadu|kerala|telangana|andhra pradesh|west bengal|odisha|jharkhand|chhattisgarh|uttarakhand|himachal pradesh|jammu and kashmir|delhi)/i,
      gender: /(male|female|girl|boy)/i,
    };

    const extractedData: ExtractedData = {};

    // Extract score/percentile
    if (examType === 'NEET UG') {
      const scoreMatch = message.match(patterns.neetScore);
      if (scoreMatch) extractedData.neetScore = scoreMatch[1];
    } else if (examType === 'JEE Main') {
      const percentileMatch = message.match(patterns.jeePercentile);
      if (percentileMatch) extractedData.jeeMainPercentile = percentileMatch[1];
    }

    // Extract rank
    const rankMatch = message.match(patterns.rank);
    if (rankMatch) extractedData.rank = rankMatch[1];

    // Extract category
    const categoryMatch = message.match(patterns.category);
    if (categoryMatch) extractedData.category = categoryMatch[1].toLowerCase();

    // Extract state
    const stateMatch = message.match(patterns.state);
    if (stateMatch) extractedData.domicileState = stateMatch[1];

    // Extract gender
    const genderMatch = message.match(patterns.gender);
    if (genderMatch) {
      const g = genderMatch[1].toLowerCase();
      extractedData.gender = g === 'girl' ? 'female' : g === 'boy' ? 'male' : g;
    }

    return extractedData;
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

    // Extract data from user message
    const extractedData = extractDataFromMessage(input);
    
    // Simulate AI processing
    setTimeout(() => {
      let aiResponse = '';
      
      if (Object.keys(extractedData).length > 0) {
        aiResponse = `Great! I found this information:\n`;
        if (extractedData.neetScore) aiResponse += `✓ NEET Score: ${extractedData.neetScore}/720\n`;
        if (extractedData.jeeMainPercentile) aiResponse += `✓ JEE Main Percentile: ${extractedData.jeeMainPercentile}%\n`;
        if (extractedData.category) aiResponse += `✓ Category: ${extractedData.category.toUpperCase()}\n`;
        if (extractedData.domicileState) aiResponse += `✓ State: ${extractedData.domicileState}\n`;
        if (extractedData.gender) aiResponse += `✓ Gender: ${extractedData.gender}\n`;
        
        aiResponse += `\nI'll use this to find your best college options! You can provide more details or ask me specific questions like "Which colleges are safest for women?" or "Show me low-cost options."`;
        
        // Pass extracted data to parent component
        onDataExtracted(extractedData);
      } else {
        aiResponse = `I understand you're looking for guidance! Could you tell me more specific details like your exact score, category (General/OBC/SC/ST), and home state? This will help me give you better recommendations.`;
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Chat with Al-Naseeh
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <ScrollArea className="flex-1 mb-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${
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
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
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
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message or click mic to speak..."
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
      </CardContent>
    </Card>
  );
};
