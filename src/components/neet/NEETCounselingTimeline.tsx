
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface NEETCounselingTimelineProps {
  language: 'en' | 'hi' | 'ur';
}

export const NEETCounselingTimeline = ({ language }: NEETCounselingTimelineProps) => {
  const timeline = [
    { 
      phase: 'Round 1 Registration', 
      date: 'July 15-25, 2024', 
      status: 'upcoming',
      description: 'AIQ Round 1 registration and choice filling'
    },
    { 
      phase: 'Round 1 Allotment', 
      date: 'July 30, 2024', 
      status: 'upcoming',
      description: 'Seat allotment results declaration'
    },
    { 
      phase: 'Round 2 Registration', 
      date: 'August 5-15, 2024', 
      status: 'upcoming',
      description: 'AIQ Round 2 registration and choice filling'
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {language === 'en' ? 'NEET Counseling Timeline' :
             language === 'hi' ? 'नीट काउंसलिंग समयरेखा' :
             'نیٹ کاؤنسلنگ ٹائم لائن'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{item.phase}</h4>
                    <Badge variant={item.status === 'upcoming' ? 'secondary' : 'default'}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{item.date}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
