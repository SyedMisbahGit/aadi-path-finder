
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, BookOpen } from 'lucide-react';
import type { JEEProfile } from '@/types/jee';

interface JEEProfileFormProps {
  onSubmit: (profile: JEEProfile) => void;
  language: 'en' | 'hi' | 'ur';
  initialData?: JEEProfile | null;
}

export const JEEProfileForm = ({ onSubmit, language, initialData }: JEEProfileFormProps) => {
  const [formData, setFormData] = useState<JEEProfile>({
    jeePercentile: 0,
    category: 'general',
    state: '',
    gender: 'male',
    preferredBranches: [],
    budget: 'government',
    preferences: {
      location: [],
      collegeType: ['nit'],
      placementPriority: 7
    }
  });

  const branches = [
    'Computer Science Engineering',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Aerospace Engineering',
    'Biotechnology'
  ];

  const states = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 
    'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 
    'Uttar Pradesh', 'West Bengal'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.jeePercentile < 1) {
      alert('Please enter a valid JEE percentile');
      return;
    }
    onSubmit(formData);
  };

  const handleBranchToggle = (branch: string) => {
    const updated = formData.preferredBranches.includes(branch)
      ? formData.preferredBranches.filter(b => b !== branch)
      : [...formData.preferredBranches, branch];
    setFormData({...formData, preferredBranches: updated});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {language === 'en' ? 'JEE Profile Information' : 
             language === 'hi' ? 'जेईई प्रोफ़ाइल जानकारी' : 
             'جے ای ای پروفائل کی معلومات'}
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
            <Label htmlFor="percentile">
              {language === 'en' ? 'JEE Main Percentile *' : 
               language === 'hi' ? 'जेईई मेन पर्सेंटाइल *' : 
               'جے ای ای مین پرسنٹائل *'}
            </Label>
            <Input
              id="percentile"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              value={formData.jeePercentile}
              onChange={(e) => setFormData({...formData, jeePercentile: parseFloat(e.target.value) || 0})}
              placeholder="Enter JEE Main percentile"
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
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
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
            <BookOpen className="w-5 h-5" />
            {language === 'en' ? 'Branch Preferences' : 
             language === 'hi' ? 'शाखा प्राथमिकताएं' : 
             'برانچ کی ترجیحات'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {branches.map((branch) => (
              <div key={branch} className="flex items-center space-x-2">
                <Checkbox 
                  id={branch}
                  checked={formData.preferredBranches.includes(branch)}
                  onCheckedChange={() => handleBranchToggle(branch)}
                />
                <Label htmlFor={branch} className="text-sm">
                  {branch}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
        {language === 'en' ? 'Generate College Predictions' : 
         language === 'hi' ? 'कॉलेज भविष्यवाणी जेनरेट करें' : 
         'کالج کی پیش گوئی تیار کریں'}
      </Button>
    </form>
  );
};
