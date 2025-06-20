
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { User, MapPin, DollarSign } from 'lucide-react';
import type { NEETProfile } from '@/types/neet';

interface NEETProfileFormProps {
  onSubmit: (profile: NEETProfile) => void;
  language: 'en' | 'hi' | 'ur';
  initialData?: NEETProfile | null;
}

export const NEETProfileForm = ({ onSubmit, language, initialData }: NEETProfileFormProps) => {
  const [formData, setFormData] = useState<NEETProfile>({
    neetScore: 0,
    category: 'general',
    state: '',
    domicile: true,
    gender: 'female',
    budget: 'government',
    preferences: {
      hostel: false,
      hijabFriendly: false,
      femaleOnly: false,
      location: [],
      courseType: ['mbbs']
    },
    safetyPriority: 8
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.neetScore < 1) {
      alert('Please enter a valid NEET score');
      return;
    }
    onSubmit(formData);
  };

  const states = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 
    'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
    'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {language === 'en' ? 'Personal Information' : 
             language === 'hi' ? 'व्यक्तिगत जानकारी' : 
             'ذاتی معلومات'}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              {language === 'en' ? 'Full Name (Optional)' : 
               language === 'hi' ? 'पूरा नाम (वैकल्पिक)' : 
               'مکمل نام (اختیاری)'}
            </Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder={language === 'en' ? 'Enter your name' : 
                          language === 'hi' ? 'अपना नाम दर्ज करें' : 
                          'اپنا نام درج کریں'}
            />
          </div>
          
          <div>
            <Label htmlFor="neetScore">
              {language === 'en' ? 'NEET Score *' : 
               language === 'hi' ? 'नीट स्कोर *' : 
               'نیٹ سکور *'}
            </Label>
            <Input
              id="neetScore"
              type="number"
              min="0"
              max="720"
              required
              value={formData.neetScore}
              onChange={(e) => setFormData({...formData, neetScore: parseInt(e.target.value) || 0})}
              placeholder="Enter NEET score (0-720)"
            />
          </div>

          <div>
            <Label>
              {language === 'en' ? 'Category *' : 
               language === 'hi' ? 'श्रेणी *' : 
               'کیٹگری *'}
            </Label>
            <Select value={formData.category} onValueChange={(value: any) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General/UR</SelectItem>
                <SelectItem value="obc">OBC-NCL</SelectItem>
                <SelectItem value="sc">SC</SelectItem>
                <SelectItem value="st">ST</SelectItem>
                <SelectItem value="ews">EWS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              {language === 'en' ? 'Gender *' : 
               language === 'hi' ? 'लिंग *' : 
               'جنس *'}
            </Label>
            <Select value={formData.gender} onValueChange={(value: any) => setFormData({...formData, gender: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              {language === 'en' ? 'State *' : 
               language === 'hi' ? 'राज्य *' : 
               'ریاست *'}
            </Label>
            <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              {language === 'en' ? 'Budget Preference' : 
               language === 'hi' ? 'बजट प्राथमिकता' : 
               'بجٹ کی ترجیح'}
            </Label>
            <Select value={formData.budget} onValueChange={(value: any) => setFormData({...formData, budget: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="government">Government Only</SelectItem>
                <SelectItem value="private">Private OK</SelectItem>
                <SelectItem value="any">Any (Govt + Private)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {language === 'en' ? 'Preferences & Requirements' : 
             language === 'hi' ? 'प्राथमिकताएं और आवश्यकताएं' : 
             'ترجیحات اور ضروریات'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hostel"
                checked={formData.preferences.hostel}
                onCheckedChange={(checked) => 
                  setFormData({
                    ...formData, 
                    preferences: {...formData.preferences, hostel: !!checked}
                  })
                }
              />
              <Label htmlFor="hostel">
                {language === 'en' ? 'Need Hostel Facility' : 
                 language === 'hi' ? 'हॉस्टल सुविधा चाहिए' : 
                 'ہاسٹل کی سہولت درکار'}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hijabFriendly"
                checked={formData.preferences.hijabFriendly}
                onCheckedChange={(checked) => 
                  setFormData({
                    ...formData, 
                    preferences: {...formData.preferences, hijabFriendly: !!checked}
                  })
                }
              />
              <Label htmlFor="hijabFriendly">
                {language === 'en' ? 'Hijab-Friendly Environment' : 
                 language === 'hi' ? 'हिजाब-फ्रेंडली वातावरण' : 
                 'حجاب دوست ماحول'}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="femaleOnly"
                checked={formData.preferences.femaleOnly}
                onCheckedChange={(checked) => 
                  setFormData({
                    ...formData, 
                    preferences: {...formData.preferences, femaleOnly: !!checked}
                  })
                }
              />
              <Label htmlFor="femaleOnly">
                {language === 'en' ? 'Female-Only Hostel' : 
                 language === 'hi' ? 'केवल महिला हॉस्टल' : 
                 'صرف خواتین ہاسٹل'}
              </Label>
            </div>
          </div>

          <div>
            <Label>
              {language === 'en' ? 'Safety Priority (1-10)' : 
               language === 'hi' ? 'सुरक्षा प्राथमिकता (1-10)' : 
               'حفاظت کی ترجیح (1-10)'}
            </Label>
            <div className="mt-2">
              <Slider
                value={[formData.safetyPriority || 8]}
                onValueChange={(value) => setFormData({...formData, safetyPriority: value[0]})}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Low Priority</span>
                <span>Current: {formData.safetyPriority}</span>
                <span>High Priority</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
        {language === 'en' ? 'Generate College Predictions' : 
         language === 'hi' ? 'कॉलेज भविष्यवाणी जेनरेट करें' : 
         'کالج کی پیش گوئی تیار کریں'}
      </Button>
    </form>
  );
};
