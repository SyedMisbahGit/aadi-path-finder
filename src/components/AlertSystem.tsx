
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
  studentProfile: any;
}

export const AlertSystem = ({ studentProfile }: AlertSystemProps) => {
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
  }, [studentProfile]);

  const generateActiveAlerts = () => {
    const alerts = [];
    const currentDate = new Date();

    // NEET Counseling Timeline Alerts
    if (studentProfile?.examName === 'neet-ug') {
      alerts.push({
        id: 'neet-round1',
        type: 'counseling',
        priority: 'high',
        title: 'NEET UG Round 1 Registration',
        message: 'MCC Round 1 registration opens on July 15, 2024. Prepare your documents now!',
        date: '2024-07-15',
        actionRequired: true,
        documents: ['NEET Admit Card', 'Category Certificate', 'Domicile Certificate']
      });

      alerts.push({
        id: 'document-verification',
        type: 'documents',
        priority: 'medium',
        title: 'Document Verification Reminder',
        message: 'Ensure all documents are ready for verification. Check requirements based on your category and state.',
        date: '2024-07-10',
        actionRequired: true
      });
    }

    // Cutoff prediction alerts
    if (studentProfile?.neetScore) {
      const score = parseInt(studentProfile.neetScore);
      if (score >= 400 && score <= 550) {
        alerts.push({
          id: 'cutoff-watch',
          type: 'cutoff',
          priority: 'medium',
          title: 'Cutoff Trends for Your Score Range',
          message: `Based on your ${score} marks, Round 2 cutoffs are crucial. We'll notify you of any changes.`,
          date: currentDate.toISOString().split('T')[0],
          actionRequired: false
        });
      }
    }

    setActiveAlerts(alerts);
  };

  const savePreferences = () => {
    localStorage.setItem('alert-preferences', JSON.stringify(preferences));
    localStorage.setItem('contact-info', JSON.stringify(contactInfo));
    toast.success("Alert preferences saved successfully!");
  };

  const testWhatsAppAlert = () => {
    if (!contactInfo.whatsappNumber) {
      toast.error("Please enter WhatsApp number first");
      return;
    }

    const message = `🤖 *Al-Naseeh Alert Test*

السلام علیکم ${studentProfile?.name || 'Student'}!

This is a test alert from Al-Naseeh counseling system.

Your profile:
📊 Score: ${studentProfile?.neetScore || 'Not provided'}
📋 Category: ${studentProfile?.category || 'Not provided'}
📍 State: ${studentProfile?.domicileState || 'Not provided'}

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
    toast.success("WhatsApp alert sent! Check your phone.");
  };

  const scheduleAlert = (alertId: string) => {
    // In production, this would integrate with backend scheduling
    toast.success("Alert scheduled successfully!");
  };

  const generateWhatsAppMessage = (alert: any) => {
    const baseMessage = `🤖 *Al-Naseeh Alert*

${alert.title}

${alert.message}

${alert.actionRequired ? '⚠️ Action Required' : 'ℹ️ Information'}

Date: ${new Date(alert.date).toLocaleDateString('en-IN')}`;

    if (alert.documents) {
      const docs = alert.documents.map((doc: string, index: number) => `${index + 1}. ${doc}`).join('\n');
      return `${baseMessage}

📄 Required Documents:
${docs}

Prepare these documents in advance to avoid last-minute rush.

Al-Naseeh Team`;
    }

    return `${baseMessage}

For more details, visit your Al-Naseeh dashboard.

Best regards,
Al-Naseeh Team`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alert Preferences
            <span className="text-sm text-gray-500">تنبیہات کی ترتیبات</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="Enter 10-digit number"
                value={contactInfo.whatsappNumber}
                onChange={(e) => setContactInfo(prev => ({ ...prev, whatsappNumber: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="parentNumber">Parent's WhatsApp (Optional)</Label>
              <Input
                id="parentNumber"
                type="tel"
                placeholder="Parent's number"
                value={contactInfo.parentNumber}
                onChange={(e) => setContactInfo(prev => ({ ...prev, parentNumber: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="parentEmail">Parent's Email (Optional)</Label>
              <Input
                id="parentEmail"
                type="email"
                placeholder="parent@email.com"
                value={contactInfo.parentEmail}
                onChange={(e) => setContactInfo(prev => ({ ...prev, parentEmail: e.target.value }))}
              />
            </div>
          </div>

          {/* Alert Channels */}
          <div>
            <h4 className="font-semibold mb-3">Alert Channels / تنبیہ کے ذرائع</h4>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-600" />
                  <span>SMS Alerts</span>
                </div>
                <Switch
                  checked={preferences.sms}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, sms: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Alert Types */}
          <div>
            <h4 className="font-semibold mb-3">Alert Types / تنبیہ کی اقسام</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Counseling Round Updates</span>
                <Switch
                  checked={preferences.roundUpdates}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, roundUpdates: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Cutoff Changes</span>
                <Switch
                  checked={preferences.cutoffChanges}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, cutoffChanges: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Document Reminders</span>
                <Switch
                  checked={preferences.documentReminders}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, documentReminders: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Important Dates</span>
                <Switch
                  checked={preferences.counselingDates}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, counselingDates: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={savePreferences} className="flex-1">
              Save Preferences
            </Button>
            <Button variant="outline" onClick={testWhatsAppAlert}>
              Test WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Alerts
            <Badge variant="secondary">{activeAlerts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No active alerts at the moment</p>
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
                        Date: {new Date(alert.date).toLocaleDateString('en-IN')}
                      </p>
                      {alert.documents && (
                        <div className="mt-2">
                          <p className="text-xs font-medium">Required Documents:</p>
                          <ul className="text-xs text-gray-600 mt-1">
                            {alert.documents.map((doc: string, index: number) => (
                              <li key={index}>• {doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {alert.actionRequired && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Action Required
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const message = generateWhatsAppMessage(alert);
                          const whatsappUrl = `https://wa.me/91${contactInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                        disabled={!contactInfo.whatsappNumber}
                      >
                        Share on WhatsApp
                      </Button>
                    </div>
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
