
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { aiService } from "@/services/aiService";

interface VoiceAIChatProps {
  language: 'en' | 'hi' | 'ur';
  onQueryProcessed: (result: any) => void;
}

export const VoiceAIChat = ({ language, onQueryProcessed }: VoiceAIChatProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-IN';

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsListening(false);
        
        toast.success(`Heard: ${transcript}`);
        await processVoiceQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
      toast.info('Listening... Speak now');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceQuery = async (query: string) => {
    setIsProcessing(true);
    
    try {
      // Analyze the query using AI
      const analysis = await aiService.analyzeQuery(query);
      
      // Get recommendations based on analysis
      const recommendations = await aiService.getCollegeRecommendations(analysis);
      
      // Generate voice response
      const response = generateVoiceResponse(analysis, recommendations);
      
      // Speak the response
      await speakResponse(response);
      
      // Pass results to parent component
      onQueryProcessed({ analysis, recommendations, response });
      
    } catch (error) {
      console.error('Voice query processing error:', error);
      toast.error('Failed to process voice query');
      await speakResponse('Sorry, I could not process your query. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateVoiceResponse = (analysis: any, recommendations: any[]) => {
    const { examType, score, category } = analysis;
    const topCollege = recommendations[0];
    
    let response = '';
    
    if (language === 'hi') {
      response = `आपके ${score} अंकों के साथ ${category} category में, ${topCollege?.name || 'government college'} में admission की संभावना ${topCollege?.admissionProbability || 70}% है। मैं आपको ${recommendations.length} colleges की list भेज रहा हूं।`;
    } else if (language === 'ur') {
      response = `آپ کے ${score} marks کے ساتھ ${category} category میں، ${topCollege?.name || 'government college'} میں admission کا chance ${topCollege?.admissionProbability || 70}% ہے۔ میں آپ کو ${recommendations.length} colleges کی list بھیج رہا ہوں۔`;
    } else {
      response = `With your ${score} marks in ${category} category, you have ${topCollege?.admissionProbability || 70}% chance at ${topCollege?.name || 'government colleges'}. I'm showing you ${recommendations.length} college options.`;
    }
    
    return response;
  };

  const speakResponse = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (synthRef.current && text) {
        setIsSpeaking(true);
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-IN';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        synthRef.current.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const stopSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          Voice AI Chat - صوتی AI چیٹ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex justify-center gap-4 mb-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-6 py-3`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Voice Chat
                </>
              )}
            </Button>
            
            <Button
              onClick={isSpeaking ? stopSpeaking : undefined}
              disabled={!isSpeaking}
              variant="outline"
              className="px-6 py-3"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Stop Speaking
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  AI Response
                </>
              )}
            </Button>
          </div>
          
          {isListening && (
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Processing your query with AI...</p>
            </div>
          )}
        </div>
        
        {transcript && (
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-sm text-gray-700">
              <strong>You said:</strong> {transcript}
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 text-center">
          <p>
            {language === 'hi' && 'हिंदी में बोलें • Voice commands supported'}
            {language === 'ur' && 'اردو میں بولیں • Voice commands supported'}
            {language === 'en' && 'Speak in English, Hindi, or Urdu • Voice commands supported'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
