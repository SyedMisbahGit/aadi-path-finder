
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Info, Zap } from "lucide-react";
import { toast } from "sonner";

interface JEEAdvancedAssessmentData {
  jeeAdvancedRank: string;
  category: string;
  gender: string;
  preferredIITZones: string[];
  preferredBranches: string[];
  hostelPreference: string;
  budgetRange: string;
  languagePreference: string;
  additionalInfo: string;
}

interface JEEAdvancedAssessmentFormProps {
  onSubmit: (data: JEEAdvancedAssessmentData) => void;
  isSubmitting: boolean;
}

export const JEEAdvancedAssessmentForm = ({ onSubmit, isSubmitting }: JEEAdvancedAssessmentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JEEAdvancedAssessmentData>({
    jeeAdvancedRank: "",
    category: "",
    gender: "",
    preferredIITZones: [],
    preferredBranches: [],
    hostelPreference: "",
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
    if (!formData.jeeAdvancedRank || !formData.category) {
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
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">JEE Advanced 2025 Score Details</span>
              </div>
              <p className="text-xs text-purple-800">Find these details on your JEE Advanced scorecard</p>
            </div>

            <div>
              <Label htmlFor="jeeAdvancedRank">🎯 JEE Advanced AIR (All India Rank) *</Label>
              <Input
                id="jeeAdvancedRank"
                type="number"
                value={formData.jeeAdvancedRank}
                onChange={(e) => handleInputChange("jeeAdvancedRank", e.target.value)}
                placeholder="e.g., 2500"
              />
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="hostelPreference">🏠 Hostel Type Preference</Label>
              <Select onValueChange={(value) => handleInputChange("hostelPreference", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hostel preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gender-neutral">Gender-Neutral</SelectItem>
                  <SelectItem value="female-only">Female-Only</SelectItem>
                  <SelectItem value="no-preference">No Preference</SelectItem>
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
                  <SelectItem value="0-2">₹0 - ₹2 Lakh (IIT fees)</SelectItem>
                  <SelectItem value="2-5">₹2 - ₹5 Lakh (including hostels)</SelectItem>
                  <SelectItem value="5+">₹5+ Lakh (premium expenses)</SelectItem>
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
                placeholder="Any specific IIT preferences, branch interests, or additional information you'd like to share..."
                className="h-24"
              />
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">🤖 Al-Naseeh Will Analyze:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• IIT-wise branch allocation probability</li>
                <li>• JoSAA round-by-round prediction</li>
                <li>• Gender-neutral vs Female-only seats</li>
                <li>• Real-time 2025 closing rank trends</li>
                <li>• Branch preference optimization</li>
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
            {currentStep === 1 && "JEE Advanced 2025 Score Details"}
            {currentStep === 2 && "IIT & Branch Preferences"}
            {currentStep === 3 && "Additional Preferences"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Enter your JEE Advanced 2025 exam performance details"}
            {currentStep === 2 && "Share your IIT campus and branch preferences"}
            {currentStep === 3 && "Help us personalize your IIT recommendations"}
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
