
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin } from 'lucide-react';
import type { NEETProfile } from '@/types/neet';

interface NEETSeatMatrixProps {
  profile: NEETProfile | null;
  language: 'en' | 'hi' | 'ur';
}

export const NEETSeatMatrix = ({ profile, language }: NEETSeatMatrixProps) => {
  const seatData = [
    { state: 'Maharashtra', government: 2500, private: 1200, total: 3700 },
    { state: 'Karnataka', government: 2200, private: 1800, total: 4000 },
    { state: 'Tamil Nadu', government: 2800, private: 1500, total: 4300 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {language === 'en' ? 'NEET Seat Matrix 2024' :
             language === 'hi' ? 'नीट सीट मैट्रिक्स 2024' :
             'نیٹ سیٹ میٹرکس 2024'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seatData.map((data, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{data.state}</span>
                  </div>
                  <Badge variant="secondary">Total: {data.total}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{data.government}</div>
                    <div className="text-sm text-gray-500">Government</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{data.private}</div>
                    <div className="text-sm text-gray-500">Private</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{data.total}</div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
