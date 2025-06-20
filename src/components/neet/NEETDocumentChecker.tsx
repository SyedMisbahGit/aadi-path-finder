
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle } from 'lucide-react';
import type { NEETProfile } from '@/types/neet';

interface NEETDocumentCheckerProps {
  profile: NEETProfile | null;
  language: 'en' | 'hi' | 'ur';
}

export const NEETDocumentChecker = ({ profile, language }: NEETDocumentCheckerProps) => {
  const documents = [
    { name: 'NEET Admit Card', required: true, status: 'pending' },
    { name: 'NEET Score Card', required: true, status: 'pending' },
    { name: 'Class 10 Certificate', required: true, status: 'pending' },
    { name: 'Class 12 Certificate', required: true, status: 'pending' },
    { name: 'Category Certificate', required: profile?.category !== 'general', status: 'pending' },
    { name: 'Domicile Certificate', required: true, status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {language === 'en' ? 'Document Checklist' :
             language === 'hi' ? 'दस्तावेज़ सूची' :
             'دستاویزات کی فہرست'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <span className={doc.required ? 'font-medium' : 'text-gray-600'}>
                    {doc.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {doc.required && (
                    <Badge variant="destructive" className="text-xs">
                      {language === 'en' ? 'Required' :
                       language === 'hi' ? 'आवश्यक' :
                       'ضروری'}
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {language === 'en' ? 'Pending' :
                     language === 'hi' ? 'लंबित' :
                     'باقی'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
