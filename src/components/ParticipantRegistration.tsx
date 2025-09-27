import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, User, Mail, Building, GraduationCap, Briefcase, Linkedin, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storage, UserData } from "@/utils/storage";

interface ParticipantRegistrationProps {
  onBack: () => void;
  onComplete: (data: UserData) => void;
}

const ParticipantRegistration = ({ onBack, onComplete }: ParticipantRegistrationProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    type: 'professional' as 'professional' | 'student',
    linkedinConnect: false,
    interests: [] as string[],
  });

  // Load existing data on mount
  useEffect(() => {
    const existingData = storage.getUserData();
    if (existingData) {
      setFormData({
        name: existingData.name || '',
        email: existingData.email || '',
        organization: existingData.organization || '',
        type: existingData.type || 'professional',
        linkedinConnect: existingData.linkedinConnect || false,
        interests: existingData.interests || [],
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userData: Partial<UserData> = {
      ...formData,
      points: 100, // Welcome bonus
      badges: [
        { name: "First Timer", icon: "🎯", earned: true, earnedAt: new Date() },
        { name: "Networker", icon: "🤝", earned: false },
        { name: "AI Explorer", icon: "🤖", earned: false },
        { name: "Session Master", icon: "📚", earned: false },
      ],
      agenda: [],
      connections: [],
    };

    const success = storage.saveUserData(userData);
    
    if (success) {
      toast({
        title: "Registration successful!",
        description: "Welcome to IPX! You earned 100 welcome points.",
        className: "bg-success text-success-foreground"
      });
      
      const savedData = storage.getUserData();
      if (savedData) {
        onComplete(savedData);
      }
    } else {
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleLinkedInConnect = () => {
    setFormData(prev => ({
      ...prev,
      name: "Sarah Johnson",
      email: "sarah.johnson@techcorp.com",
      organization: "TechCorp Solutions",
      linkedinConnect: true
    }));
    
    toast({
      title: "Profile pre-filled",
      description: "Information imported from LinkedIn",
      className: "bg-primary text-primary-foreground"
    });
  };

  const interestOptions = [
    "AI & Machine Learning",
    "Cloud Computing", 
    "Mobile Development",
    "Data Science",
    "Cybersecurity",
    "DevOps",
    "UI/UX Design",
    "Blockchain"
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="bg-gradient-primary p-4 text-white shadow-glass">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 mobile-touch micro-interaction"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Join IPX Community</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* LinkedIn Connect Option */}
          <Card className="shadow-glass card-interactive border-0">
            <CardContent className="p-4">
              <Button
                type="button"
                className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white mobile-touch btn-hover micro-interaction"
                onClick={handleLinkedInConnect}
                disabled={isLoading}
              >
                <Linkedin className="w-4 h-4 mr-2" />
                {formData.linkedinConnect ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Connected to LinkedIn
                  </>
                ) : (
                  "Connect with LinkedIn"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="shadow-glass card-interactive border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mobile-touch border-0 bg-muted/50 focus:bg-background transition-colors"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  className="mobile-touch border-0 bg-muted/50 focus:bg-background transition-colors"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-sm font-medium">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="Your company or university"
                  className="mobile-touch border-0 bg-muted/50 focus:bg-background transition-colors"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Participant Type */}
          <Card className="shadow-glass card-interactive border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Participant Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: 'professional' | 'student') => setFormData(prev => ({ ...prev, type: value }))}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors micro-interaction">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Professional</div>
                      <div className="text-xs text-muted-foreground">Industry professional</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors micro-interaction">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Student</div>
                      <div className="text-xs text-muted-foreground">University or college student</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="shadow-glass card-interactive border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Areas of Interest</CardTitle>
              <p className="text-sm text-muted-foreground">Select topics that interest you for personalized recommendations</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors micro-interaction">
                    <Checkbox
                      id={interest}
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            interests: [...prev.interests, interest]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            interests: prev.interests.filter(i => i !== interest)
                          }));
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Label htmlFor={interest} className="text-sm cursor-pointer flex-1">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary text-white btn-hover mobile-touch text-lg py-6 shadow-floating font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Creating Profile...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ParticipantRegistration;