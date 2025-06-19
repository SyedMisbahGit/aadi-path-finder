
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Info, Calculator } from "lucide-react";
import { toast } from "sonner";

interface JEEMainAssessmentData {
  jeeMainPercentile: string;
  jeeMainRank: string;
  category: string;
  gender: string;
  homeState: string;
  preferredBranches: string[];
  collegeTypePreference: string;
  budgetRange: string;
  languagePreference: string;
  additionalInfo: string;
}

interface JEEMainAssessmentFormProps {
  onSubmit: (data: JEEMainAssessmentData) => void;
  isSubmitting: boolean;
}

export const JEEMainAssessmentForm = ({ onSubmit, isSubmitting }: JEEMainAssessmentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JEEMainAssessmentData>({
    jeeMainPercentile: "",
    jeeMainRank: "",
    category: "",
    gender: "",
    homeState: "",
    preferredBranches: [],
    collegeTypePreference: "",
    budgetRange: "",
    languagePreference: "",
    additionalInfo: ""
  });

  const totalSteps = 3;
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
    if (!formData.jeeMainPercentile || !formData.category || !formData.homeState) {
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
                <Calculator className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">JEE Main 2025 Score Details</span>
              </div>
              <p className="text-xs text-blue-800">Find these details on your JEE Main scorecard</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jeeMainPercentile">📊 JEE Main Percentile *</Label>
                <Input
                  id="jeeMainPercentile"
                  type="number"
                  step="0.01"
                  value={formData.jeeMainPercentile}
                  onChange={(e) => handleInputChange("jeeMainPercentile", e.target.value)}
                  placeholder="e.g., 95.5"
                />
              </div>
              
              <div>
                <Label htmlFor="jeeMainRank">🎯 JEE Main Rank (CRL)</Label>
                <Input
                  id="jeeMainRank"
                  type="number"
                  value={formData.jeeMainRank}
                  onChange={(e) => handleInputChange("jeeMainRank", e.target.value)}
                  placeholder="e.g., 15000"
                />
              </div>
            </div>

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
              <Label htmlFor="homeState">🏠 Home State *</Label>
              <Select onValueChange={(value) => handleInputChange("homeState", value)}>
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

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="collegeTypePreference">🏛️ College Type Preference</Label>
              <Select onValueChange={(value) => handleInputChange("collegeTypePreference", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nit">NITs (National Institutes of Technology)</SelectItem>
                  <SelectItem value="iiit">IIITs (Indian Institutes of Information Technology)</SelectItem>
                  <SelectItem value="gfti">GFTIs (Government Funded Technical Institutes)</SelectItem>
                  <SelectItem value="private">Private Engineering Colleges</SelectItem>
                  <SelectItem value="all">All Types</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budgetRange">💰 Annual Budget Range</Label>
              <Select onValueChange={(value) => handleInputChange("budgetRange", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">₹0 - ₹1 Lakh (NITs/IIITs)</SelectItem>
                  <SelectItem value="1-3">₹1 - ₹3 Lakh (GFTIs)</SelectItem>
                  <SelectItem value="3-8">₹3 - ₹8 Lakh (Private)</SelectItem>
                  <SelectItem value="8+">₹8+ Lakh (Premium Private)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="languagePreference">🗣️ Language Medium Preference</Label>
              <Select onValueChange={(value) => handleInputChange("languagePreference", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="bilingual">Bilingual (Hindi + English)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="additionalInfo">📝 Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                placeholder="Any specific preferences, location constraints, or additional information you'd like to share..."
                className="h-24"
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">🤖 Al-Naseeh Will Analyze:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• JoSAA counseling rounds prediction</li>
                <li>• NIT vs IIIT vs GFTI options</li>
                <li>• Home state quota advantages</li>
                <li>• Real-time 2025 cutoff predictions</li>
                <li>• Branch availability analysis</li>
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
            {currentStep === 1 && "JEE Main 2025 Score Details"}
            {currentStep === 2 && "College & Course Preferences"}
            {currentStep === 3 && "Additional Preferences"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Enter your JEE Main 2025 exam performance details"}
            {currentStep === 2 && "Share your engineering college and branch preferences"}
            {currentStep === 3 && "Help us personalize your recommendations"}
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
