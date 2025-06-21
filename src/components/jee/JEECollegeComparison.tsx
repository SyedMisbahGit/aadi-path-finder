
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCompare } from 'lucide-react';

interface JEECollegeComparisonProps {
  language: 'en' | 'hi' | 'ur';
}

export const JEECollegeComparison = ({ language }: JEECollegeComparisonProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="w-5 h-5" />
          {language === 'en' ? 'College Comparison' :
           language === 'hi' ? 'कॉलेज तुलना' :
           'کالج کا موازنہ'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-12">
        <p className="text-gray-500">
          {language === 'en' ? 'JEE College Comparison - Coming Soon' :
           language === 'hi' ? 'जेईई कॉलेज तुलना - जल्द आ रहा है' :
           'جے ای ای کالج کا موازنہ - جلد آ رہا ہے'}
        </p>
      </CardContent>
    </Card>
  );
};
