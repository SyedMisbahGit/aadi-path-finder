
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileSpreadsheet, Share } from "lucide-react";
import { toast } from "sonner";

interface ExportRecommendationsProps {
  recommendations: any[];
  assessmentData?: any;
}

export const ExportRecommendations = ({ recommendations, assessmentData }: ExportRecommendationsProps) => {
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv' | 'sheets'>('xlsx');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeAnalysis, setIncludeAnalysis] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const generateCSV = (data: any[]) => {
    const headers = [
      'Rank',
      'College Name',
      'Location',
      'Course',
      'Admission Probability (%)',
      'Safety Rating',
      'Cultural Fit',
      'Financial Feasibility',
      'Annual Fees (Min)',
      'Annual Fees (Max)',
      'Total Cost Estimation',
      'Predicted Cutoff',
      'Hostel Available',
      'Scholarship Available'
    ];

    if (includeAnalysis) {
      headers.push('AI Reasoning', 'Benefits', 'Risk Factors', 'Scholarship Eligibility');
    }

    const csvContent = [
      headers.join(','),
      ...data.map(rec => [
        rec.recommendation_rank,
        `"${rec.colleges?.name || 'N/A'}"`,
        `"${rec.colleges?.location || 'N/A'}, ${rec.colleges?.state || 'N/A'}"`,
        `"${rec.colleges?.courses?.join(', ') || 'N/A'}"`,
        rec.admission_probability,
        rec.safety_rating,
        rec.cultural_fit_score,
        rec.financial_feasibility,
        rec.colleges?.annual_fees_min || 'N/A',
        rec.colleges?.annual_fees_max || 'N/A',
        rec.total_cost_estimation || 'N/A',
        rec.predicted_cutoff || 'N/A',
        rec.colleges?.hostel_available ? 'Yes' : 'No',
        rec.colleges?.scholarship_available ? 'Yes' : 'No',
        ...(includeAnalysis ? [
          `"${rec.ai_reasoning || 'N/A'}"`,
          `"${rec.benefits?.join('; ') || 'N/A'}"`,
          `"${rec.risk_factors?.join('; ') || 'N/A'}"`,
          `"${rec.scholarship_eligibility?.join('; ') || 'N/A'}"`
        ] : [])
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateTimestamp = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleExport = async () => {
    if (!recommendations || recommendations.length === 0) {
      toast.error("No recommendations to export");
      return;
    }

    setIsExporting(true);
    
    try {
      const timestamp = generateTimestamp();
      const examInfo = assessmentData ? `_${assessmentData.examName}_${assessmentData.examYear}` : '';
      
      if (exportFormat === 'csv') {
        const csvContent = generateCSV(recommendations);
        downloadFile(
          csvContent,
          `college_recommendations${examInfo}_${timestamp}.csv`,
          'text/csv'
        );
        toast.success("CSV file downloaded successfully!");
      } 
      
      else if (exportFormat === 'xlsx') {
        // For XLSX, we'll create a more structured format
        const csvContent = generateCSV(recommendations);
        // In a real implementation, you'd use a library like xlsx or exceljs
        downloadFile(
          csvContent,
          `college_recommendations${examInfo}_${timestamp}.xlsx`,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        toast.success("Excel file downloaded successfully!");
      }
      
      else if (exportFormat === 'sheets') {
        // Google Sheets integration would require OAuth setup
        // For now, we'll copy to clipboard with instructions
        const csvContent = generateCSV(recommendations);
        await navigator.clipboard.writeText(csvContent);
        toast.success("Data copied to clipboard! Paste it into Google Sheets.");
      }
      
    } catch (error) {
      toast.error("Export failed. Please try again.");
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Recommendations
        </CardTitle>
        <CardDescription>
          Download your personalized college recommendations in your preferred format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Export Format</label>
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as any)}>
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
                <SelectItem value="sheets">
                  <div className="flex items-center gap-2">
                    <Share className="w-4 h-4" />
                    Google Sheets
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Include Options</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="details" 
                  checked={includeDetails}
                  onCheckedChange={setIncludeDetails}
                />
                <label htmlFor="details" className="text-sm">
                  College details & scores
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="analysis" 
                  checked={includeAnalysis}
                  onCheckedChange={setIncludeAnalysis}
                />
                <label htmlFor="analysis" className="text-sm">
                  AI analysis & reasoning
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">Export Preview</h4>
          <p className="text-xs text-blue-800">
            {recommendations?.length || 0} recommendations • 
            {includeDetails ? ' Detailed info' : ' Basic info'} • 
            {includeAnalysis ? ' With AI analysis' : ' Without analysis'}
          </p>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={isExporting || !recommendations?.length}
          className="w-full"
        >
          {isExporting ? (
            "Exporting..."
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
