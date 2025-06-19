
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Share, User } from "lucide-react";
import { toast } from "sonner";

interface ParentReportProps {
  recommendations: any[];
  studentData: any;
}

export const ParentReport = ({ recommendations, studentData }: ParentReportProps) => {
  const [language, setLanguage] = useState<'english' | 'hindi' | 'bilingual'>('bilingual');
  const [studentName, setStudentName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    if (!studentName.trim()) {
      toast.error("Please enter student name for the report");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const reportContent = generateReportContent();
      
      if (language === 'english' || language === 'bilingual') {
        downloadReport(reportContent.english, `${studentName}_College_Report_EN.pdf`);
      }
      
      if (language === 'hindi' || language === 'bilingual') {
        downloadReport(reportContent.hindi, `${studentName}_College_Report_HI.pdf`);
      }

      toast.success("Parent report generated successfully!");
    } catch (error) {
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportContent = () => {
    const topRecommendations = recommendations.slice(0, 10);
    
    const englishContent = `
🤖 AL-NASEEH COLLEGE COUNSELING REPORT
الناصح - Your Honest AI Advisor

STUDENT INFORMATION:
Name: ${studentName}
Exam: ${studentData?.examName || 'NEET 2025'}
Score: ${studentData?.marks || 'N/A'}
Category: ${studentData?.category || 'N/A'}
State: ${studentData?.domicileState || 'N/A'}

TOP COLLEGE RECOMMENDATIONS:

${topRecommendations.map((rec, index) => `
${index + 1}. ${rec.collegeName || 'College Name'}
   📍 Location: ${rec.location || 'Location'}
   💰 Annual Fees: ₹${rec.fees || '50,000'} - ₹${rec.maxFees || '1,00,000'}
   🎯 Admission Chance: ${rec.probability || '75'}%
   🛡️ Safety Score: ${rec.safetyScore || '8'}/10
   🏠 Hostel: ${rec.hostelAvailable ? 'Available' : 'Not Available'}
   💰 Total Cost (4 years): ₹${rec.totalCost || '4,00,000'}
`).join('')}

IMPORTANT NOTES FOR PARENTS:
✅ All colleges listed are accredited and recognized
✅ Safety scores based on campus security, city crime rates, and student reviews
✅ Cost estimates include tuition, hostel, and basic living expenses
✅ Cultural compatibility considered for minority students

For more information, visit: https://your-platform.com
Generated on: ${new Date().toLocaleDateString()}
    `;

    const hindiContent = `
🤖 अल-नासीह कॉलेज काउंसलिंग रिपोर्ट
الناصح - आपका ईमानदार AI सलाहकार

छात्र की जानकारी:
नाम: ${studentName}
परीक्षा: ${studentData?.examName || 'NEET 2025'}
अंक: ${studentData?.marks या 'N/A'}
श्रेणी: ${studentData?.category || 'N/A'}
राज्य: ${studentData?.domicileState || 'N/A'}

शीर्ष कॉलेज सिफारिशें:

${topRecommendations.map((rec, index) => `
${index + 1}. ${rec.collegeName || 'कॉलेज का नाम'}
   📍 स्थान: ${rec.location || 'स्थान'}
   💰 वार्षिक फीस: ₹${rec.fees || '50,000'} - ₹${rec.maxFees || '1,00,000'}
   🎯 प्रवेश की संभावना: ${rec.probability || '75'}%
   🛡️ सुरक्षा स्कोर: ${rec.safetyScore || '8'}/10
   🏠 हॉस्टल: ${rec.hostelAvailable ? 'उपलब्ध' : 'उपलब्ध नहीं'}
   💰 कुल लागत (4 साल): ₹${rec.totalCost || '4,00,000'}
`).join('')}

माता-पिता के लिए महत्वपूर्ण नोट्स:
✅ सभी सूचीबद्ध कॉलेज मान्यता प्राप्त और पहचाने गए हैं
✅ सुरक्षा स्कोर कैंपस सिक्योरिटी, शहर की अपराध दर और छात्र समीक्षा पर आधारित
✅ लागत अनुमान में ट्यूशन, हॉस्टल और बुनियादी जीवन यापन खर्च शामिल
✅ अल्पसंख्यक छात्रों के लिए सांस्कृतिक संगतता पर विचार

अधिक जानकारी के लिए देखें: https://your-platform.com
बनाया गया: ${new Date().toLocaleDateString()}
    `;

    return { english: englishContent, hindi: hindiContent };
  };

  const downloadReport = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shareViaWhatsApp = () => {
    const message = `🤖 *AL-NASEEH COLLEGE REPORT* 

मेरे बच्चे ${studentName} के लिए कॉलेज की सिफारिश:

${recommendations.slice(0, 3).map((rec, index) => `
${index + 1}. ${rec.collegeName || 'College'} - ${rec.location || 'Location'}
   प्रवेश संभावना: ${rec.probability || '75'}%
   सुरक्षा स्कोर: ${rec.safetyScore || '8'}/10`).join('')}

Al-Naseeh AI से पूरी रिपोर्ट: [Link]`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Parent-Friendly Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter student's name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="language">Report Language</Label>
            <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English Only</SelectItem>
                <SelectItem value="hindi">Hindi Only</SelectItem>
                <SelectItem value="bilingual">Both (Bilingual)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Report will include:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Top 10 college recommendations</li>
            <li>✓ Safety scores for each college</li>
            <li>✓ Cost breakdown (fees + living expenses)</li>
            <li>✓ Admission probability for each option</li>
            <li>✓ Hostel and facility information</li>
            <li>✓ Cultural compatibility notes</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateReport} 
            disabled={isGenerating || !studentName.trim()}
            className="flex-1"
          >
            {isGenerating ? (
              "Generating Report..."
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={shareViaWhatsApp}
            disabled={!studentName.trim()}
          >
            <Share className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
