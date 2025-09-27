import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Trophy, 
  Users, 
  QrCode, 
  Star, 
  Clock, 
  MapPin, 
  Zap,
  Award,
  Target,
  Plus,
  CheckCircle,
  LogOut,
  List,
  UserCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storage, UserData, EventData } from "@/utils/storage";
import badgeIcon from "@/assets/badge-icon.png";
import qrPlaceholder from "@/assets/qr-placeholder.png";

interface ParticipantDashboardProps {
  userData: UserData;
}

const ParticipantDashboard = ({ userData }: ParticipantDashboardProps) => {
  const { toast } = useToast();
  const [points, setPoints] = useState(userData.points || 0);
  const [badges, setBadges] = useState(userData.badges || [
    { name: "First Timer", icon: "🎯", earned: true, earnedAt: new Date() },
    { name: "Networker", icon: "🤝", earned: false },
    { name: "AI Explorer", icon: "🤖", earned: false },
    { name: "Session Master", icon: "📚", earned: false },
  ]);
  const [agenda, setAgenda] = useState(userData.agenda || []);
  const [connections, setConnections] = useState(userData.connections || []);
  const [connectedPeople, setConnectedPeople] = useState<string[]>([]);
  const [requestedConnections, setRequestedConnections] = useState<string[]>([]);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [allEvents, setAllEvents] = useState<EventData[]>([]);

  useEffect(() => {
    // Sync with storage on component mount
    const latestData = storage.getUserData();
    if (latestData) {
      setPoints(latestData.points || 0);
      setBadges(latestData.badges || badges);
      setAgenda(latestData.agenda || []);
      setConnections(latestData.connections || []);
    }
    
    // Load events from storage
    let events = storage.getEventsData();
    if (!events || events.length === 0) {
      // Create default events if none exist (same as coordinator)
      const defaultEvents = [
        {
          name: "AI & Innovation Summit 2024",
          description: "Exploring the future of AI technology",
          date: "2024-10-15",
          location: "Tech Conference Center",
          sessions: [
            {
              id: 1,
              title: "AI in Mobile Development",
              speaker: "Dr. Sarah Chen",
              time: "10:00 AM - 11:00 AM",
              track: "AI Track",
              location: "Hall A",
              attendees: 95,
            },
            {
              id: 2,
              title: "Future of Machine Learning",
              speaker: "Prof. James Wilson",
              time: "2:00 PM - 3:00 PM",
              track: "ML Track",
              location: "Hall B",
              attendees: 120,
            }
          ],
          createdAt: new Date()
        },
        {
          name: "Cloud Computing Workshop",
          description: "Hands-on cloud technology workshop",
          date: "2024-10-20",
          location: "Innovation Hub",
          sessions: [
            {
              id: 3,
              title: "Cloud-Native Architecture",
              speaker: "Mike Johnson",
              time: "10:00 AM - 12:00 PM",
              track: "Cloud Track",
              location: "Workshop Room",
              attendees: 45,
            }
          ],
          createdAt: new Date()
        }
      ];
      
      defaultEvents.forEach(event => storage.saveEventData(event));
      events = storage.getEventsData() || [];
    }
    setAllEvents(events);
  }, []);

  const handleAddToAgenda = (session: any) => {
    const success = storage.addToAgenda({
      sessionId: session.id,
      title: session.title
    });
    
    if (success) {
      const updatedData = storage.getUserData();
      if (updatedData) {
        setAgenda(updatedData.agenda || []);
        setPoints(updatedData.points || 0);
      }
      
      toast({
        title: "Added to agenda!",
        description: `${session.title} has been added to your schedule. +10 points!`,
        className: "bg-success text-success-foreground"
      });
    }
  };

  const handleConnect = (person: any) => {
    if (requestedConnections.includes(person.name)) {
      // Second click - actually connect
      const success = storage.addConnection({
        name: person.name,
        role: person.role
      });
      
      if (success) {
        const updatedData = storage.getUserData();
        if (updatedData) {
          setConnections(updatedData.connections || []);
          setPoints(updatedData.points || 0);
          setBadges(updatedData.badges || badges);
        }
        
        setConnectedPeople(prev => [...prev, person.name]);
        setRequestedConnections(prev => prev.filter(name => name !== person.name));
        
        toast({
          title: "Connection made!",
          description: `You're now connected with ${person.name}. +25 points!`,
          className: "bg-success text-success-foreground"
        });
      }
    } else {
      // First click - request connection
      setRequestedConnections(prev => [...prev, person.name]);
      toast({
        title: "Connection requested!",
        description: `Connection request sent to ${person.name}.`,
      });
    }
  };

  const handleLogout = () => {
    storage.clearAllData();
    // Navigate back to role selection screen
    window.location.href = "/";
  };

  // Generate recommended sessions from actual events
  const getRecommendedSessions = () => {
    const allSessions = getAllSessions();
    return allSessions.slice(0, 3).map((session, index) => ({
      ...session,
      matchScore: [95, 88, 82][index] || 85 // Add match scores for recommended sessions
    }));
  };

  const networkingSuggestions = [
    {
      name: "Alex Rodriguez",
      role: "Senior Developer at Microsoft",
      commonInterests: ["AI", "Cloud Computing"],
      meetingProbability: "High",
    },
    {
      name: "Emma Thompson",
      role: "UX Designer at SAP", 
      commonInterests: ["UI/UX Design", "Mobile Development"],
      meetingProbability: "Medium",
    },
  ];

  // Get all sessions from events
  const getAllSessions = () => {
    const allSessions: any[] = [];
    allEvents.forEach(event => {
      if (event.sessions) {
        event.sessions.forEach(session => {
          allSessions.push({
            ...session,
            eventName: event.name
          });
        });
      }
    });
    return allSessions;
  };

  return (
    <div className="min-h-screen bg-gradient-surface pb-20">
      {/* Header with Points and Badges */}
      <div className="bg-gradient-hero text-white p-6 shadow-glass">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {userData.name}!</h1>
            <p className="opacity-90 text-sm">Ready for an amazing experience?</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-white/20 micro-interaction"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex justify-center items-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold points-glow mb-1">{points}</div>
            <div className="text-sm opacity-90">Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{badges.filter(b => b.earned).length}</div>
            <div className="text-sm opacity-90">Badges</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{agenda.length}</div>
            <div className="text-sm opacity-90">Sessions</div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                badge.earned 
                  ? 'bg-success text-white badge-bounce shadow-soft' 
                  : 'bg-white/20 text-white/50'
              }`}
            >
              {badge.icon}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="fixed bottom-0 left-0 right-0 grid w-full grid-cols-3 bg-white shadow-lg border-t border-border h-16 rounded-none z-50">
            <TabsTrigger value="sessions" className="font-medium flex flex-col gap-1 h-full">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="networking" className="font-medium flex flex-col gap-1 h-full">
              <Users className="w-4 h-4" />
              <span className="text-xs">Network</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="font-medium flex flex-col gap-1 h-full">
              <QrCode className="w-4 h-4" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-6 mt-6">
            <div className="flex gap-2 mb-4">
              <Button 
                variant={!showAllSessions ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAllSessions(false)}
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-1" />
                Recommended
              </Button>
              <Button 
                variant={showAllSessions ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAllSessions(true)}
                className="flex-1"
              >
                <List className="w-4 h-4 mr-1" />
                All Events
              </Button>
            </div>

            <Card className="shadow-glass card-interactive border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {showAllSessions ? (
                    <>
                      <List className="w-5 h-5 text-primary" />
                      All Events
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-accent" />
                      AI Recommendations
                    </>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {showAllSessions 
                    ? "Browse all available sessions"
                    : "Personalized sessions based on your interests"
                  }
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {(showAllSessions ? getAllSessions() : getRecommendedSessions()).map((session) => {
                  const isInAgenda = agenda.some(a => a.sessionId === session.id);
                  
                  return (
                    <div key={session.id} className="border rounded-xl p-5 hover:bg-muted/50 card-interactive bg-card/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-base">{session.title}</h3>
                          {showAllSessions && session.eventName && (
                            <p className="text-xs text-muted-foreground">from {session.eventName}</p>
                          )}
                        </div>
                        {!showAllSessions && session.matchScore && (
                          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                            {session.matchScore}% match
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 font-medium">{session.speaker}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.location}
                        </div>
                      </div>
                      <Button 
                        className={`w-full mobile-touch micro-interaction ${
                          isInAgenda 
                            ? 'bg-success text-success-foreground hover:bg-success/90' 
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                        size="sm"
                        onClick={() => !isInAgenda && handleAddToAgenda(session)}
                        disabled={isInAgenda}
                      >
                        {isInAgenda ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Added to Agenda
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Agenda
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="networking" className="space-y-6 mt-6">
            <Card className="shadow-glass card-interactive border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  Suggested Connections
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  People you should meet based on shared interests
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {networkingSuggestions.map((person, index) => {
                  const isConnected = connections.some(c => c.name === person.name);
                  const isRequested = requestedConnections.includes(person.name);
                  
                  return (
                    <div key={index} className="border rounded-xl p-5 hover:bg-muted/50 card-interactive bg-card/50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-soft">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base">{person.name}</h3>
                          <p className="text-sm text-muted-foreground">{person.role}</p>
                          <div className="text-xs text-success font-medium mt-1">
                            {person.meetingProbability} match probability
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {person.commonInterests.map((interest, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        variant={isConnected ? "secondary" : "outline"}
                        className={`w-full mobile-touch micro-interaction ${
                          isConnected ? 'bg-success text-success-foreground' : 
                          isRequested ? 'bg-warning text-warning-foreground' : ''
                        }`}
                        size="sm"
                        onClick={() => !isConnected && handleConnect(person)}
                        disabled={isConnected}
                      >
                        {isConnected ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Connected
                          </>
                        ) : isRequested ? (
                          "Requested"
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="shadow-glass card-interactive border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-secondary" />
                  My Agenda ({agenda.length})
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sessions you've added to your schedule
                </p>
              </CardHeader>
              <CardContent>
                {agenda.length > 0 ? (
                  <div className="space-y-3">
                    {agenda.map((session, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-card/50">
                        <h4 className="font-medium text-sm">{session.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Added on {session.addedAt.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No sessions in your agenda yet. Browse sessions to add some!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-glass card-interactive border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCheck className="w-5 h-5 text-primary" />
                  My Connections ({connections.length})
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  People in your professional network
                </p>
              </CardHeader>
              <CardContent>
                {connections.length > 0 ? (
                  <div className="space-y-3">
                    {connections.map((connection, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-card/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {connection.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{connection.name}</h4>
                            <p className="text-xs text-muted-foreground">{connection.role}</p>
                            <p className="text-xs text-muted-foreground">
                              Connected on {connection.connectedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No connections yet. Visit the Network tab to connect with people!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-glass card-interactive border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <QrCode className="w-5 h-5 text-secondary" />
                  Your QR Code
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Show this code for quick check-in at sessions
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-glass p-4">
                  <img 
                    src={qrPlaceholder} 
                    alt="QR Code" 
                    className="w-full h-full rounded-xl"
                  />
                </div>
                <Button className="w-full bg-gradient-secondary text-white mobile-touch btn-hover font-medium">
                  Share Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-glass card-interactive border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-accent" />
                  Achievement Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Sessions Attended</span>
                      <span className="text-sm font-bold">{agenda.length}/10</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(agenda.length * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Network Connections</span>
                      <span className="text-sm font-bold">{connections.length}/20</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-success h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(connections.length * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Total Points</span>
                      <span className="text-sm font-bold">{points}/2000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-secondary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(points / 20, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParticipantDashboard;