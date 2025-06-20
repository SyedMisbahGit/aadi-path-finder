
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageCircle, Mail, Phone, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AlertPreferences {
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
  roundUpdates: boolean;
  cutoffChanges: boolean;
  documentReminders: boolean;
  counselingDates: boolean;
}

interface AlertSystemProps {
  language: 'en' | 'hi' | 'ur';
}

export const AlertSystem = ({ language }: AlertSystemProps) => {
  const [preferences, setPreferences] = useState<AlertPreferences>({
    whatsapp: true,
    email: true,
    sms: false,
    roundUpdates: true,
    cutoffChanges: true,
    documentReminders: true,
    counselingDates: true
  });

  const [contactInfo, setContactInfo] = useState({
    whatsappNumber: '',
    email: '',
    parentNumber: '',
    parentEmail: ''
  });

  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('alert-preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }

    const savedContact = localStorage.getItem('contact-info');
    if (savedContact) {
      setContactInfo(JSON.parse(savedContact));
    }

    // Generate current alerts
    generateActiveAlerts();
  }, []);

  const generateActiveAlerts = () => {
    const alerts = [];
    const currentDate = new Date();

    // Sample alerts
    alerts.push({
      id: 'counseling-update',
      type: 'counseling',
      priority: 'high',
      title: language === 'en' ? 'Counseling Round 1 Registration Open' : 
             language === 'hi' ? 'काउंसलिंग राउंड 1 पंजीकरण खुला' : 
             'کاؤنسلنگ راؤنڈ 1 رجسٹریشن کھلا',
      message: language === 'en' ? 'Registration for Round 1 counseling has started. Complete your registration now!' : 
               language === 'hi' ? 'राउंड 1 काउंसलिंग के लिए पंजीकरण शुरू हो गया है। अभी अपना पंजीकरण पूरा करें!' : 
               'راؤنڈ 1 کاؤنسلنگ کے لیے رجسٹریشن شروع ہو گئی ہے۔ اب اپنی رجسٹریشن مکمل کریں!',
      date: currentDate.toISOString().split('T')[0],
      actionRequired: true
    });

    setActiveAlerts(alerts);
  };

  const savePreferences = () => {
    localStorage.setItem('alert-preferences', JSON.stringify(preferences));
    localStorage.setItem('contact-info', JSON.stringify(contactInfo));
    toast.success(
      language === 'en' ? "Alert preferences saved successfully!" :
      language === 'hi' ? "अलर्ट प्राथमिकताएं सफलतापूर्वक सहेजी गईं!" :
      "الرٹ کی ترجیحات کامیابی سے محفوظ ہو گئیں!"
    );
  };

  const testWhatsAppAlert = () => {
    if (!contactInfo.whatsappNumber) {
      toast.error(
        language === 'en' ? "Please enter WhatsApp number first" :
        language === 'hi' ? "कृपया पहले व्हाट्सऐप नंबर दर्ज करें" :
        "برائے کرم پہلے واٹس ایپ نمبر درج کریں"
      );
      return;
    }

    const message = `🤖 *Al-Naseeh Alert Test*

${language === 'ur' ? 'السلام علیکم' : 'Hello'}!

This is a test alert from Al-Naseeh counseling system.

You will receive important updates about:
✅ Counseling round openings
✅ Cutoff changes  
✅ Document verification dates
✅ Seat allotment results

Stay prepared! 🎯

Best regards,
Al-Naseeh Team`;

    const whatsappUrl = `https://wa.me/91${contactInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(
      language === 'en' ? "WhatsApp alert sent! Check your phone." :
      language === 'hi' ? "व्हाट्सऐप अलर्ट भेजा गया! अपना फोन चेक करें।" :
      "واٹس ایپ الرٹ بھیجا گیا! اپنا فون چیک کریں۔"
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {language === 'en' ? 'Alert Preferences' :
             language === 'hi' ? 'अलर्ट प्राथमिकताएं' :
             'الرٹ کی ترجیحات'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp">
                {language === 'en' ? 'WhatsApp Number' :
                 language === 'hi' ? 'व्हाट्सऐप नंबर' :
                 'واٹس ایپ نمبر'}
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder={language === 'en' ? 'Enter 10-digit number' :
                           language === 'hi' ? '10 अंकों का नंबर दर्ज करें' :
                           '10 ہندسوں کا نمبر درج کریں'}
                value={contactInfo.whatsappNumber}
                onChange={(e) => setContactInfo(prev => ({ ...prev, whatsappNumber: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">
                {language === 'en' ? 'Email Address' :
                 language === 'hi' ? 'ईमेल पता' :
                 'ای میل پتہ'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          {/* Alert Channels */}
          <div>
            <h4 className="font-semibold mb-3">
              {language === 'en' ? 'Alert Channels' :
               language === 'hi' ? 'अलर्ट चैनल' :
               'الرٹ چینلز'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span>WhatsApp Alerts</span>
                </div>
                <Switch
                  checked={preferences.whatsapp}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, whatsapp: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Email Alerts</span>
                </div>
                <Switch
                  checked={preferences.email}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, email: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={savePreferences} className="flex-1">
              {language === 'en' ? 'Save Preferences' :
               language === 'hi' ? 'प्राथमिकताएं सहेजें' :
               'ترجیحات محفوظ کریں'}
            </Button>
            <Button variant="outline" onClick={testWhatsAppAlert}>
              {language === 'en' ? 'Test WhatsApp' :
               language === 'hi' ? 'व्हाट्सऐप टेस्ट' :
               'واٹس ایپ ٹیسٹ'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {language === 'en' ? 'Active Alerts' :
             language === 'hi' ? 'सक्रिय अलर्ट' :
             'فعال الرٹس'}
            <Badge variant="secondary">{activeAlerts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {language === 'en' ? 'No active alerts at the moment' :
               language === 'hi' ? 'इस समय कोई सक्रिय अलर्ट नहीं' :
               'فی الوقت کوئی فعال الرٹ نہیں'}
            </p>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                          {alert.priority}
                        </Badge>
                        <span className="text-sm text-gray-500">{alert.type}</span>
                      </div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {language === 'en' ? 'Date: ' :
                         language === 'hi' ? 'दिनांक: ' :
                         'تاریخ: '}
                        {new Date(alert.date).toLocaleDateString()}
                      </p>
                    </div>
                    {alert.actionRequired && (
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        {language === 'en' ? 'Action Required' :
                         language === 'hi' ? 'कार्रवाई आवश्यक' :
                         'کارروائی درکار'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
