import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileSpreadsheet, FileText, Globe, Share } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface CollegeData {
  name: string;
  location: string;
  fees?: {
    min: number;
    max: number;
  };
  admissionProbability: number;
  safetyRating: number;
  culturalFit?: number;
  aiReasoning?: string;
}

interface StudentProfile {
  name?: string;
  category?: string;
  state?: string;
  [key: string]: unknown;
}

interface EnhancedExportSystemProps {
  data: CollegeData[];
  studentProfile: StudentProfile;
  language: 'en' | 'hi' | 'ur';
}

export const EnhancedExportSystem = ({ data, studentProfile, language }: EnhancedExportSystemProps) => {
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv' | 'pdf' | 'json'>('xlsx');
  const [includeAnalysis, setIncludeAnalysis] = useState(true);
  const [includeCultural, setIncludeCultural] = useState(true);
  const [bilingualExport, setBilingualExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const translations = {
    en: {
      collegeName: 'College Name',
      location: 'Location',
      fees: 'Annual Fees',
      probability: 'Admission Probability',
      safety: 'Safety Rating',
      cultural: 'Cultural Fit',
      reasoning: 'AI Reasoning'
    },
    hi: {
      collegeName: 'कॉलेज का नाम',
      location: 'स्थान',
      fees: 'वार्षिक फीस',
      probability: 'प्रवेश की संभावना',
      safety: 'सुरक्षा रेटिंग',
      cultural: 'सांस्कृतिक फिट',
      reasoning: 'AI तर्क'
    },
    ur: {
      collegeName: 'کالج کا نام',
      location: 'مقام',
      fees: 'سالانہ فیس',
      probability: 'داخلے کا امکان',
      safety: 'سیفٹی ریٹنگ',
      cultural: 'ثقافتی موافقت',
      reasoning: 'AI دلیل'
    }
  };

  const generateExcelReport = () => {
    const t = translations[language];
    
    const headers = [
      t.collegeName,
      t.location,
      t.fees,
      t.probability + ' (%)',
      t.safety + ' (1-10)',
      ...(includeCultural ? [t.cultural + ' (1-10)'] : []),
      ...(includeAnalysis ? [t.reasoning] : [])
    ];

    const rows = data.map(item => [
      item.name || '',
      item.location || '',
      `₹${item.fees?.min || 0} - ₹${item.fees?.max || 0}`,
      item.admissionProbability || 0,
      item.safetyRating || 0,
      ...(includeCultural ? [item.culturalFit || 0] : []),
      ...(includeAnalysis ? [item.aiReasoning || ''] : [])
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    
    // Add summary sheet
    const summaryData = [
      ['Student Profile Summary', ''],
      ['Name', studentProfile?.name || 'N/A'],
      ['Exam', studentProfile?.examType || 'N/A'],
      ['Score/Rank', studentProfile?.score || studentProfile?.rank || 'N/A'],
      ['Category', studentProfile?.category || 'N/A'],
      ['State', studentProfile?.state || 'N/A'],
      ['Generated On', new Date().toLocaleDateString()],
      ['', ''],
      ['Top Recommendations', ''],
      ...data.slice(0, 5).map(item => [item.name, `${item.admissionProbability}% chance`])
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recommendations');
    
    return workbook;
  };

  const generateCSVReport = () => {
    const t = translations[language];
    
    const headers = [
      t.collegeName,
      t.location,
      t.fees,
      t.probability,
      t.safety,
      ...(includeCultural ? [t.cultural] : []),
      ...(includeAnalysis ? [t.reasoning] : [])
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${item.name || ''}"`,
        `"${item.location || ''}"`,
        `"₹${item.fees?.min || 0} - ₹${item.fees?.max || 0}"`,
        item.admissionProbability || 0,
        item.safetyRating || 0,
        ...(includeCultural ? [item.culturalFit || 0] : []),
        ...(includeAnalysis ? [`"${item.aiReasoning || ''}"`] : [])
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  const generatePDFReport = async () => {
    // For PDF generation, we'll create a detailed HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Al-Naseeh College Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .profile { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
          .college { border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
          .college-name { font-size: 18px; font-weight: bold; color: #2563eb; }
          .details { margin: 10px 0; }
          .probability { color: #16a34a; font-weight: bold; }
          .reasoning { font-style: italic; color: #666; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🤖 Al-Naseeh College Counseling Report</h1>
          <p>الناصح - Your Honest AI Advisor</p>
        </div>
        
        <div class="profile">
          <h2>Student Profile</h2>
          <p><strong>Exam:</strong> ${studentProfile?.examType || 'N/A'}</p>
          <p><strong>Score:</strong> ${studentProfile?.score || studentProfile?.rank || 'N/A'}</p>
          <p><strong>Category:</strong> ${studentProfile?.category || 'N/A'}</p>
          <p><strong>State:</strong> ${studentProfile?.state || 'N/A'}</p>
        </div>

        <h2>College Recommendations</h2>
        ${data.map(college => `
          <div class="college">
            <div class="college-name">${college.name}</div>
            <div class="details">
              <p><strong>Location:</strong> ${college.location}</p>
              <p><strong>Fees:</strong> ₹${college.fees?.min || 0} - ₹${college.fees?.max || 0}</p>
              <p class="probability"><strong>Admission Probability:</strong> ${college.admissionProbability}%</p>
              <p><strong>Safety Rating:</strong> ${college.safetyRating}/10</p>
              ${includeCultural ? `<p><strong>Cultural Fit:</strong> ${college.culturalFit}/10</p>` : ''}
              ${includeAnalysis ? `<div class="reasoning"><strong>AI Analysis:</strong> ${college.aiReasoning}</div>` : ''}
            </div>
          </div>
        `).join('')}
        
        <div style="margin-top: 30px; text-align: center; color: #666;">
          <p>Generated on ${new Date().toLocaleDateString()} by Al-Naseeh AI</p>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  };

  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `al-naseeh-report-${timestamp}`;
      
      switch (exportFormat) {
        case 'xlsx': {
          const workbook = generateExcelReport();
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(excelBlob, `${filename}.xlsx`);
          break;
        }
          
        case 'csv': {
          const csvContent = generateCSVReport();
          const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          saveAs(csvBlob, `${filename}.csv`);
          break;
        }
          
        case 'pdf': {
          const htmlContent = await generatePDFReport();
          const pdfBlob = new Blob([htmlContent], { type: 'text/html' });
          saveAs(pdfBlob, `${filename}.html`);
          break;
        }
          
        case 'json': {
          const jsonContent = JSON.stringify({
            studentProfile,
            recommendations: data,
            exportSettings: {
              includeAnalysis,
              includeCultural,
              bilingualExport,
              language
            },
            generatedAt: new Date().toISOString()
          }, null, 2);
          const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
          saveAs(jsonBlob, `${filename}.json`);
          break;
        }
      }
      
      toast.success(`Report exported successfully as ${exportFormat.toUpperCase()}!`);
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Enhanced Export System
          {language === 'ur' && <span className="text-sm">- بہتر ایکسپورٹ سسٹم</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Export Format</label>
            <Select value={exportFormat} onValueChange={(value: 'xlsx' | 'csv' | 'pdf' | 'json') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xlsx">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel (.xlsx)
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    CSV (.csv)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF Report
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    JSON Data
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Export Options</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="analysis" 
                  checked={includeAnalysis}
                  onCheckedChange={(checked) => setIncludeAnalysis(checked === true)}
                />
                <label htmlFor="analysis" className="text-sm">
                  Include AI Analysis
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cultural" 
                  checked={includeCultural}
                  onCheckedChange={(checked) => setIncludeCultural(checked === true)}
                />
                <label htmlFor="cultural" className="text-sm">
                  Cultural Fit Scores
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bilingual" 
                  checked={bilingualExport}
                  onCheckedChange={(checked) => setBilingualExport(checked === true)}
                />
                <label htmlFor="bilingual" className="text-sm">
                  Bilingual Headers
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">Export Preview</h4>
          <p className="text-xs text-blue-800">
            {data?.length || 0} colleges • 
            {includeAnalysis ? ' With AI analysis' : ' Basic info'} • 
            {includeCultural ? ' Cultural scores' : ' No cultural data'} •
            {bilingualExport ? ` ${language.toUpperCase()} + English` : ` ${language.toUpperCase()} only`}
          </p>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={isExporting || !data?.length}
          className="w-full"
        >
          {isExporting ? (
            "Exporting..."
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export {exportFormat.toUpperCase()} Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
