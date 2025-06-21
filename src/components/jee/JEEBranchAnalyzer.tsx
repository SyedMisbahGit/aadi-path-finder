
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import type { JEEProfile } from '@/types/jee';

interface JEEBranchAnalyzerProps {
  profile: JEEProfile | null;
  language: 'en' | 'hi' | 'ur';
}

export const JEEBranchAnalyzer = ({ profile, language }: JEEBranchAnalyzerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          {language === 'en' ? 'Branch Analyzer' :
           language === 'hi' ? 'शाखा विश्लेषक' :
           'برانچ تجزیہ کار'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-12">
        <p className="text-gray-500">
          {language === 'en' ? 'JEE Branch Analyzer - Coming Soon' :
           language === 'hi' ? 'जेईई शाखा विश्लेषक - जल्द आ रहा है' :
           'جے ای ای برانچ تجزیہ کار - جلد آ رہا ہے'}
        </p>
      </CardContent>
    </Card>
  );
};
