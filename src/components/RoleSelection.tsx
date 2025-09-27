import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCog, ArrowRight, Sparkles, Globe } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: 'participant' | 'coordinator') => void;
}

const RoleSelection = ({ onSelectRole }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen px-6">
        {/* App Header */}
        <div className="pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tight text-primary">IPX</h1>
            <Globe className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-xl font-medium text-foreground">
            Intelligent Participant Experience
          </p>
        </div>

        {/* Main Button Area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-4">
            
            {/* Participant Button */}
            <Card className="border shadow-soft">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Participant Login</h3>
                <Button 
                  onClick={() => onSelectRole('participant')}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mobile-touch h-12 font-medium"
                >
                  Continue as Participant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Event Coordinator Button */}
            <Card className="border shadow-soft">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserCog className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Event Login</h3>
                <Button 
                  onClick={() => onSelectRole('coordinator')}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 mobile-touch h-12 font-medium"
                >
                  Continue as Coordinator
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Microsoft & SAP Hackathon
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;