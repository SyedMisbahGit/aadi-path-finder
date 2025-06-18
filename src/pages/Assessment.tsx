import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAssessment, AssessmentData } from "@/hooks/useAssessment";
import { AuthModal } from "@/components/AuthModal";
import { AIRecommendations } from "@/components/AIRecommendations";
import { toast } from "sonner";

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submittedAssessmentId, setSubmittedAssessmentId] = useState<string | null>(null);
  const { user } = useAuth();
  const { saveAssessment } = useAssessment();
  
  const [formData, setFormData] = useState<AssessmentData>({
    // Exam details
    examName: "",
    examYear: "",
    marks: "",
    totalMarks: "",
    
    // Personal details
    category: "",
    gender: "",
    domicileState: "",
    
    // Preferences
    preferredStates: [],
    budgetRange: "",
    hostOrDay: "",
    
    // Special considerations
    religiousPractices: "",
    specialNeeds: "",
    
    // Additional preferences
    collegeType: "",
    climatePreference: "",
    languagePreference: "",
    
    // Other details
    additionalInfo: ""
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const result = await saveAssessment.mutateAsync(formData);
      setSubmittedAssessmentId(result.id);
      toast.success("Assessment completed! Generating AI recommendations...");
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  // If assessment is submitted, show recommendations
  if (submittedAssessmentId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Your College Recommendations</h1>
          </div>
          
          <AIRecommendations assessmentId={submittedAssessmentId} />
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="examName">Entrance Exam</Label>
                <Select onValueChange={(value) => handleInputChange("examName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neet-ug">NEET UG</SelectItem>
                    <SelectItem value="jee-main">JEE Main</SelectItem>
                    <SelectItem value="jee-advanced">JEE Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="examYear">Exam Year</Label>
                <Select onValueChange={(value) => handleInputChange("examYear", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marks">Your Marks/Score</Label>
                <Input
                  id="marks"
                  type="number"
                  value={formData.marks}
                  onChange={(e) => handleInputChange("marks", e.target.value)}
                  placeholder="Enter your marks"
                />
              </div>
              
              <div>
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => handleInputChange("totalMarks", e.target.value)}
                  placeholder="Total marks"
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
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
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
              <Label htmlFor="domicileState">Domicile State</Label>
              <Select onValueChange={(value) => handleInputChange("domicileState", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your domicile state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="assam">Assam</SelectItem>
                  <SelectItem value="bihar">Bihar</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="kerala">Kerala</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
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
                <Label htmlFor="budgetRange">Annual Budget Range</Label>
                <Select onValueChange={(value) => handleInputChange("budgetRange", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">₹0 - ₹1 Lakh</SelectItem>
                    <SelectItem value="1-3">₹1 - ₹3 Lakh</SelectItem>
                    <SelectItem value="3-5">₹3 - ₹5 Lakh</SelectItem>
                    <SelectItem value="5-10">₹5 - ₹10 Lakh</SelectItem>
                    <SelectItem value="10+">₹10+ Lakh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="hostOrDay">Accommodation Preference</Label>
                <Select onValueChange={(value) => handleInputChange("hostOrDay", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="day">Day Scholar</SelectItem>
                    <SelectItem value="both">Both Options</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="collegeType">Preferred College Type</Label>
              <Select onValueChange={(value) => handleInputChange("collegeType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select college type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="semi-government">Semi-Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="all">All Types</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="religiousPractices">Religious/Cultural Considerations</Label>
              <Textarea
                id="religiousPractices"
                value={formData.religiousPractices}
                onChange={(e) => handleInputChange("religiousPractices", e.target.value)}
                placeholder="Please mention any specific religious practices, dietary requirements, or cultural considerations (e.g., hijab, prayer facilities, halal food, etc.)"
                className="h-20"
              />
            </div>

            <div>
              <Label htmlFor="specialNeeds">Special Needs or Accessibility Requirements</Label>
              <Textarea
                id="specialNeeds"
                value={formData.specialNeeds}
                onChange={(e) => handleInputChange("specialNeeds", e.target.value)}
                placeholder="Any physical disabilities, learning differences, or accessibility requirements"
                className="h-20"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="climatePreference">Climate Preference</Label>
                <Select onValueChange={(value) => handleInputChange("climatePreference", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select climate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tropical">Tropical</SelectItem>
                    <SelectItem value="temperate">Temperate</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                    <SelectItem value="no-preference">No Preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="languagePreference">Language Preference</Label>
                <Select onValueChange={(value) => handleInputChange("languagePreference", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="regional">Regional Language</SelectItem>
                    <SelectItem value="multilingual">Multilingual Environment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                placeholder="Any other preferences, concerns, or information you'd like our AI to consider while making recommendations..."
                className="h-32"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Our AI will analyze your profile against thousands of colleges</li>
                <li>• We'll consider safety, cultural fit, and financial aspects</li>
                <li>• You'll receive personalized recommendations with detailed reasoning</li>
                <li>• Real-time cutoff predictions and admission chances</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Personal Assessment</h1>
          <p className="text-gray-600 mt-2">
            Help us understand your profile to provide the most accurate recommendations.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Exam Details"}
              {currentStep === 2 && "Personal Information"}
              {currentStep === 3 && "Preferences & Budget"}
              {currentStep === 4 && "Special Considerations"}
              {currentStep === 5 && "Final Details"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your entrance exam performance"}
              {currentStep === 2 && "Provide your personal details for quota calculations"}
              {currentStep === 3 && "Share your preferences and budget constraints"}
              {currentStep === 4 && "Help us ensure cultural and accessibility fit"}
              {currentStep === 5 && "Any additional information to improve recommendations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
            
            {/* Navigation Buttons */}
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
                  disabled={saveAssessment.isPending}
                >
                  {saveAssessment.isPending ? "Processing..." : "Get Recommendations"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    </div>
  );
};

export default Assessment;
