import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Users, 
  Calendar, 
  QrCode, 
  BarChart3, 
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storage, EventData } from "@/utils/storage";
import CreateEventDialog from "./CreateEventDialog";

const CoordinatorDashboard = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<EventData[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadEvents();
  }, [refreshKey]);

  const loadEvents = () => {
    const eventsData = storage.getEventsData();
    if (eventsData && eventsData.length > 0) {
      setEvents(eventsData);
    } else {
      // Add default events if none exist
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
      setEvents(storage.getEventsData() || []);
    }
  };

  const [sessions] = useState([
    {
      id: 1,
      title: "Opening Keynote: Future of AI",
      speaker: "Dr. Sarah Chen",
      time: "09:00 AM - 10:00 AM",
      location: "Main Hall",
      attendees: 200,
      checkedIn: 150,
      capacity: 250
    },
    {
      id: 2,
      title: "Hands-on: Building with GPT",
      speaker: "Mike Johnson",
      time: "10:30 AM - 12:00 PM",
      location: "Workshop Room A",
      attendees: 45,
      checkedIn: 32,
      capacity: 50
    }
  ]);

  const handleEventCreated = () => {
    // Refresh events list
    setRefreshKey(prev => prev + 1);
  };

  const handleGenerateQR = (sessionTitle: string) => {
    toast({
      title: "QR Code generated",
      description: `QR code for "${sessionTitle}" is ready for check-in.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary text-white p-4">
        <h1 className="text-2xl font-bold mb-2">Event Coordinator Dashboard</h1>
        <p className="opacity-90">Manage your events and engage participants</p>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <Card className="shadow-elegant">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {events.reduce((total, event) => total + (event.sessions?.length || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-elegant">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{events.length}</div>
            <div className="text-sm text-muted-foreground">Active Events</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-elegant">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {events.reduce((total, event) => 
                total + (event.sessions?.reduce((sum, session) => sum + (session.attendees || 0), 0) || 0), 0
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Attendees</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-elegant">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">92%</div>
            <div className="text-sm text-muted-foreground">Engagement Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Events</CardTitle>
                <CreateEventDialog onEventCreated={handleEventCreated} />
              </CardHeader>
              <CardContent className="space-y-4">
                {events.length > 0 ? events.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted card-interactive">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{event.name}</h3>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                      <Badge variant="default" className="bg-success">
                        active
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground mb-3">
                      <div>
                        <div className="font-medium text-foreground">{event.sessions?.length || 0}</div>
                        <div>Sessions</div>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {event.sessions?.reduce((sum, session) => sum + (session.attendees || 0), 0) || 0}
                        </div>
                        <div>Registered</div>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{event.date}</div>
                        <div>Date</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 mobile-touch">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 mobile-touch">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-8">
                    No events created yet. Click "New Event" to get started!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.flatMap(event => event.sessions || []).map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-muted">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{session.title}</h3>
                        <p className="text-xs text-muted-foreground">{session.speaker}</p>
                      </div>
                      <Badge variant="outline">
                        {session.attendees || 0}/100
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.location}
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2 mb-3">
                      <div 
                        className="bg-gradient-success h-2 rounded-full" 
                        style={{ width: `${Math.min(((session.attendees || 0) / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <Button 
                      onClick={() => handleGenerateQR(session.title)}
                      className="w-full bg-gradient-secondary text-white mobile-touch"
                      size="sm"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Event Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Registration Rate</span>
                      <span className="text-sm font-bold">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-primary h-3 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Check-in Rate</span>
                      <span className="text-sm font-bold">62%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-success h-3 rounded-full w-3/5"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Session Engagement</span>
                      <span className="text-sm font-bold">78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-secondary h-3 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-gradient-primary text-white mobile-touch">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;