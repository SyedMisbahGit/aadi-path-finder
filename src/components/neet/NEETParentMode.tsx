
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowLeft, DollarSign, MapPin, Shield } from 'lucide-react';

interface NEETParentModeProps {
  onToggleParentMode: () => void;
  language: 'en' | 'hi' | 'ur';
  onLanguageChange: (lang: 'en' | 'hi' | 'ur') => void;
}

export const NEETParentMode = ({ onToggleParentMode, language, onLanguageChange }: NEETParentModeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onToggleParentMode}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'en' ? 'Back to Student Mode' :
             language === 'hi' ? 'छात्र मोड पर वापस' :
             'اسٹوڈنٹ موڈ پر واپس'}
          </Button>
          
          {/* Language Selection */}
          <div className="flex gap-2">
            <Badge
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('en')}
              className="cursor-pointer"
            >
              English
            </Badge>
            <Badge
              variant={language === 'hi' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('hi')}
              className="cursor-pointer"
            >
              हिंदी
            </Badge>
            <Badge
              variant={language === 'ur' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('ur')}
              className="cursor-pointer"
            >
              اردو
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              {language === 'en' ? 'Parent Dashboard' :
               language === 'hi' ? 'माता-पिता डैशबोर्ड' :
               'والدین ڈیش بورڈ'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Key Priorities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    {language === 'en' ? 'Budget-Friendly Options' :
                     language === 'hi' ? 'बजट-अनुकूल विकल्प' :
                     'بجٹ کے دوستانہ اختیارات'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Government Colleges</span>
                      <span className="font-semibold">₹50K-1L/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Semi-Government</span>
                      <span className="font-semibold">₹5-8L/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Private (Subsidized)</span>
                      <span className="font-semibold">₹8-12L/year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    {language === 'en' ? 'Safety & Security' :
                     language === 'hi' ? 'सुरक्षा और सुरक्षा' :
                     'حفاظت اور سکیورٹی'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Girls' Hostel Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">24/7 Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Safe Neighborhood</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    {language === 'en' ? 'Location Preferences' :
                     language === 'hi' ? 'स्थान प्राथमिकताएं' :
                     'مقام کی ترجیحات'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Within State</span>
                      <Badge variant="secondary">Preferred</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Nearby States</span>
                      <Badge variant="outline">Acceptable</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Metro Cities</span>
                      <Badge variant="outline">Consider</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Simplified Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? 'Quick Summary for Parents' :
                   language === 'hi' ? 'माता-पिता के लिए त्वरित सारांश' :
                   'والدین کے لیے فوری خلاصہ'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">
                    {language === 'en' ? 'Your child has good chances in government medical colleges within your state. We recommend focusing on colleges with strong safety records and reasonable fees. Cultural fit and hostel facilities are also prioritized in our recommendations.' :
                     language === 'hi' ? 'आपके बच्चे के पास आपके राज्य के भीतर सरकारी मेडिकल कॉलेजों में अच्छी संभावनाएं हैं। हम मजबूत सुरक्षा रिकॉर्ड और उचित फीस वाले कॉलेजों पर ध्यान देने की सलाह देते हैं।' :
                     'آپ کے بچے کے پاس آپ کی ریاست میں سرکاری میڈیکل کالجوں میں اچھے امکانات ہیں۔ ہم مضبوط حفاظتی ریکارڈ اور مناسب فیس والے کالجوں پر توجہ دینے کی تجویز کرتے ہیں۔'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
