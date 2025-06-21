
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import type { JEEProfile } from '@/types/jee';

interface JEESeatMatrixProps {
  profile: JEEProfile | null;
  language: 'en' | 'hi' | 'ur';
}

export const JEESeatMatrix = ({ profile, language }: JEESeatMatrixProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {language === 'en' ? 'JEE Seat Matrix' :
           language === 'hi' ? 'जेईई सीट मैट्रिक्स' :
           'جے ای ای سیٹ میٹرکس'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-12">
        <p className="text-gray-500">
          {language === 'en' ? 'JEE Seat Matrix - Coming Soon' :
           language === 'hi' ? 'जेईई सीट मैट्रिक्स - जल्द आ रहा है' :
           'جے ای ای سیٹ میٹرکس - جلد آ رہا ہے'}
        </p>
      </CardContent>
    </Card>
  );
};
