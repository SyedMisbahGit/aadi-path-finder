
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Heart, Shield, Star, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI College Counselor</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/assessment" className="text-gray-500 hover:text-gray-900">Get Started</Link>
              <Link to="/colleges" className="text-gray-500 hover:text-gray-900">Browse Colleges</Link>
              <Link to="/about" className="text-gray-500 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered
            <span className="text-blue-600"> College Counselor</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized college recommendations for NEET UG, JEE Mains, and JEE Advanced based on your scores, 
            preferences, and unique circumstances. Completely free and designed for Indian students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link to="/assessment">Start Your Assessment</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link to="/demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our AI Counselor?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform considers every aspect of your profile to provide the most accurate and personalized recommendations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Safety & Cultural Fit</CardTitle>
                <CardDescription>
                  We analyze campus safety, cultural compatibility, and regional factors to ensure you feel at home.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <Star className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>AI-Powered Predictions</CardTitle>
                <CardDescription>
                  Our models analyze historical cutoffs, normalization patterns, and current trends for accurate predictions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <Heart className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Personalized Approach</CardTitle>
                <CardDescription>
                  Every recommendation considers your category, domicile, financial situation, and personal preferences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Comprehensive Database</CardTitle>
                <CardDescription>
                  Access information about government, semi-government, and private institutions across India.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Financial Planning</CardTitle>
                <CardDescription>
                  Get detailed cost breakdowns, scholarship opportunities, and financial aid matching.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <GraduationCap className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>
                  Stay updated with live counseling rounds, cutoff changes, and seat availability.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect College?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your personalized assessment now. It's completely free and takes just 10 minutes.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
            <Link to="/assessment">Begin Assessment</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-lg font-semibold">AI College Counselor</span>
            </div>
            <p className="text-gray-400">
              Empowering Indian students with AI-driven college guidance. Free, personalized, and comprehensive.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
