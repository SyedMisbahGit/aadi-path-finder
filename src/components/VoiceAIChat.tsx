
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceAIChatProps {
  language: 'en' | 'hi' | 'ur';
  onQueryProcessed?: (query: string) => void;
}

export const VoiceAIChat = ({ language, onQueryProcessed }: VoiceAIChatProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    setIsListening(true);
    // Voice recognition would be implemented here
    setTimeout(() => {
      setIsListening(false);
      setTranscript('Sample voice input received');
      if (onQueryProcessed) {
        onQueryProcessed('Sample voice query');
      }
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Voice AI Assistant' :
           language === 'hi' ? 'वॉयस एआई सहायक' :
           'وائس اے آئی اسسٹنٹ'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center gap-4 mb-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="flex items-center gap-2"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening ? 'Stop Listening' : 'Start Voice Chat'}
            </Button>
            
            <Button
              onClick={toggleSpeaking}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              {isSpeaking ? 'Mute' : 'Speaker'}
            </Button>
          </div>
          
          {isListening && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="animate-pulse flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
              <p className="text-blue-800 mt-2">
                {language === 'en' ? 'Listening...' :
                 language === 'hi' ? 'सुन रहा है...' :
                 'سن رہا ہے...'}
              </p>
            </div>
          )}
          
          {transcript && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Transcript:</p>
              <p className="font-medium">{transcript}</p>
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-gray-500">
          {language === 'en' ? 'Voice AI chat is currently in development. Full functionality coming soon!' :
           language === 'hi' ? 'वॉयस एआई चैट वर्तमान में विकास में है। पूरी कार्यक्षमता जल्द ही आ रही है!' :
           'وائس اے آئی چیٹ فی الوقت ترقی میں ہے۔ مکمل فیچرز جلد آ رہے ہیں!'}
        </div>
      </CardContent>
    </Card>
  );
};
