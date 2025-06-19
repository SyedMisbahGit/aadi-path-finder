
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";

interface NEETAssessmentData {
  neetRank: string;
  neetScore: string;
  totalMarks: string;
  biologyMarks: string;
  pcbPercentile: string;
  category: string;
  gender: string;
  domicileState: string;
  preferredStates: string[];
  budgetRange: string;
  collegePreference: string;
  coursePreference: string;
  religiousPractices: string;
  specialNeeds: string;
  additionalInfo: string;
}

interface NEETAssessmentFormProps {
  onSubmit: (data: NEETAssessmentData) => void;
  isSubmitting: boolean;
}

export const NEETAssessmentForm = ({ onSubmit, isSubmitting }: NEETAssessmentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NEETAssessmentData>({
    neetRank: "",
    neetScore: "",
    totalMarks: "720",
    biologyMarks: "",
    pcbPercentile: "",
    category: "",
    gender: "",
    domicileState: "",
    preferredStates: [],
    budgetRange: "",
    collegePreference: "",
    coursePreference: "",
    religiousPractices: "",
    specialNeeds: "",
    additionalInfo: ""
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.neetRank || !formData.neetScore || !formData.category || !formData.domicileState) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">NEET 2025 Score Details</span>
              </div>
              <p className="text-xs text-blue-800">Find these details on your NEET scorecard</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="neetRank">🎯 All India Rank (AIR) *</Label>
                <Input
                  id="neetRank"
                  type="number"
                  value={formData.neetRank}
                  onChange={(e) => handleInputChange("neetRank", e.target.value)}
                  placeholder="e.g., 15,000"
                />
              </div>
              
              <div>
                <Label htmlFor="neetScore">📊 NEET Score *</Label>
                <Input
                  id="neetScore"
                  type="number"
                  value={formData.neetScore}
                  onChange={(e) => handleInputChange("neetScore", e.target.value)}
                  placeholder="e.g., 550"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="biologyMarks">🧬 Biology Section Marks</Label>
                <Input
                  id="biologyMarks"
                  type="number"
                  value={formData.biologyMarks}
                  onChange={(e) => handleInputChange("biologyMarks", e.target.value)}
                  placeholder="e.g., 280"
                />
              </div>
              
              <div>
                <Label htmlFor="pcbPercentile">📈 PCB Percentile</Label>
                <Input
                  id="pcbPercentile"
                  type="number"
                  value={formData.pcbPercentile}
                  onChange={(e) => handleInputChange("pcbPercentile", e.target.value)}
                  placeholder="e.g., 85.5"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC-NCL</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                    <SelectItem value="ews">EWS</SelectItem>
                    <SelectItem value="pwd">PWD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="domicileState">🏠 Domicile State *</Label>
              <Select onValueChange={(value) => handleInputChange("domicileState", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your home state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="assam">Assam</SelectItem>
                  <SelectItem value="bihar">Bihar</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="kerala">Kerala</SelectItem>
                  <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="odisha">Odisha</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="telangana">Telangana</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="west-bengal">West Bengal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetRange">💰 Annual Budget Range</Label>
                <Select onValueChange={(value) => handleInputChange("budgetRange", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">₹0 - ₹1 Lakh (Government)</SelectItem>
                    <SelectItem value="1-5">₹1 - ₹5 Lakh</SelectItem>
                    <SelectItem value="5-15">₹5 - ₹15 Lakh</SelectItem>
                    <SelectItem value="15-25">₹15 - ₹25 Lakh (Private)</SelectItem>
                    <SelectItem value="25+">₹25+ Lakh (Deemed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="collegePreference">🏥 College Type Preference</Label>
                <Select onValueChange={(value) => handleInputChange("collegePreference", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government Medical Colleges</SelectItem>
                    <SelectItem value="private">Private Medical Colleges</SelectItem>
                    <SelectItem value="deemed">Deemed Universities</SelectItem>
                    <SelectItem value="aiims">AIIMS/JIPMER</SelectItem>
                    <SelectItem value="all">All Types</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="coursePreference">🩺 Course Preference</Label>
              <Select onValueChange={(value) => handleInputChange("coursePreference", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mbbs">MBBS</SelectItem>
                  <SelectItem value="bds">BDS (Dental)</SelectItem>
                  <SelectItem value="bams">BAMS (Ayurveda)</SelectItem>
                  <SelectItem value="bhms">BHMS (Homeopathy)</SelectItem>
                  <SelectItem value="bums">BUMS (Unani)</SelectItem>
                  <SelectItem value="bnys">BNYS (Naturopathy)</SelectItem>
                  <SelectItem value="bvsc">BVSc (Veterinary)</SelectItem>
                  <SelectItem value="any">Any Medical Course</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="religiousPractices">🕌 Religious/Cultural Considerations</Label>
              <Textarea
                id="religiousPractices"
                value={formData.religiousPractices}
                onChange={(e) => handleInputChange("religiousPractices", e.target.value)}
                placeholder="Any specific religious practices, dietary requirements, or cultural preferences (e.g., prayer facilities, halal food, female-friendly environment)"
                className="h-20"
              />
            </div>

            <div>
              <Label htmlFor="specialNeeds">♿ Special Needs or Accessibility</Label>
              <Textarea
                id="specialNeeds"
                value={formData.specialNeeds}
                onChange={(e) => handleInputChange("specialNeeds", e.target.value)}
                placeholder="Any physical disabilities, learning differences, or accessibility requirements"
                className="h-20"
              />
            </div>

            <div>
              <Label htmlFor="additionalInfo">📝 Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                placeholder="Any other preferences, family medical background, career goals, or information you'd like to share..."
                className="h-24"
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">🤖 Al-Naseeh Will Analyze:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• AIQ vs State Quota eligibility</li>
                <li>• Government vs Private college options</li>
                <li>• Safety, target, and dream college categories</li>
                <li>• Real-time 2025 cutoff predictions</li>
                <li>• Cultural fit and financial feasibility</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "NEET 2025 Score Details"}
            {currentStep === 2 && "Personal Information"}
            {currentStep === 3 && "College & Course Preferences"}
            {currentStep === 4 && "Additional Preferences"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Enter your NEET 2025 exam performance details"}
            {currentStep === 2 && "Provide personal details for quota and reservation calculations"}
            {currentStep === 3 && "Share your medical college and course preferences"}
            {currentStep === 4 && "Help us personalize your recommendations"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Getting Recommendations..." : "🤖 Get Al-Naseeh Recommendations"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
