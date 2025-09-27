/**
 * Browser Storage Utility for IPX Mobile App
 * Handles data persistence using localStorage with error handling
 */

export interface UserData {
  name: string;
  email: string;
  organization: string;
  type: 'professional' | 'student';
  linkedinConnect: boolean;
  interests: string[];
  points: number;
  badges: Array<{
    name: string;
    icon: string;
    earned: boolean;
    earnedAt?: Date;
  }>;
  registrationDate: Date;
  agenda: Array<{
    sessionId: number;
    title: string;
    addedAt: Date;
  }>;
  connections: Array<{
    name: string;
    role: string;
    connectedAt: Date;
  }>;
}

export interface EventData {
  name: string;
  description: string;
  date: string;
  location: string;
  sessions: Array<{
    id: number;
    title: string;
    speaker: string;
    time: string;
    track: string;
    location: string;
    attendees: number;
  }>;
  createdAt: Date;
}

class StorageManager {
  private readonly USER_KEY = 'ipx_user_data';
  private readonly EVENTS_KEY = 'ipx_events_data';
  private readonly APP_STATE_KEY = 'ipx_app_state';

  // User Data Management
  saveUserData(userData: Partial<UserData>): boolean {
    try {
      const existingData = this.getUserData();
      const updatedData = {
        ...existingData,
        ...userData,
        registrationDate: existingData?.registrationDate || new Date(),
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Failed to save user data:', error);
      return false;
    }
  }

  getUserData(): UserData | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      if (parsed.registrationDate) {
        parsed.registrationDate = new Date(parsed.registrationDate);
      }
      if (parsed.agenda) {
        parsed.agenda = parsed.agenda.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
      }
      if (parsed.connections) {
        parsed.connections = parsed.connections.map((item: any) => ({
          ...item,
          connectedAt: new Date(item.connectedAt)
        }));
      }
      return parsed;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  updateUserPoints(points: number): boolean {
    const userData = this.getUserData();
    if (!userData) return false;
    
    userData.points = (userData.points || 0) + points;
    return this.saveUserData(userData);
  }

  addBadge(badge: { name: string; icon: string }): boolean {
    const userData = this.getUserData();
    if (!userData) return false;
    
    if (!userData.badges) userData.badges = [];
    
    const existingBadge = userData.badges.find(b => b.name === badge.name);
    if (existingBadge) {
      existingBadge.earned = true;
      existingBadge.earnedAt = new Date();
    } else {
      userData.badges.push({
        ...badge,
        earned: true,
        earnedAt: new Date()
      });
    }
    
    return this.saveUserData(userData);
  }

  addToAgenda(session: { sessionId: number; title: string }): boolean {
    const userData = this.getUserData();
    if (!userData) return false;
    
    if (!userData.agenda) userData.agenda = [];
    
    const existingSession = userData.agenda.find(s => s.sessionId === session.sessionId);
    if (existingSession) return true; // Already added
    
    userData.agenda.push({
      ...session,
      addedAt: new Date()
    });
    
    // Award points for adding session
    this.updateUserPoints(10);
    
    return this.saveUserData(userData);
  }

  addConnection(connection: { name: string; role: string }): boolean {
    const userData = this.getUserData();
    if (!userData) return false;
    
    if (!userData.connections) userData.connections = [];
    
    const existingConnection = userData.connections.find(c => c.name === connection.name);
    if (existingConnection) return true; // Already connected
    
    userData.connections.push({
      ...connection,
      connectedAt: new Date()
    });
    
    // Award points and check for networking badge
    this.updateUserPoints(25);
    if (userData.connections.length >= 3) {
      this.addBadge({ name: "Networker", icon: "🤝" });
    }
    
    return this.saveUserData(userData);
  }

  // Event Data Management (for coordinators)
  saveEventData(eventData: Partial<EventData>): boolean {
    try {
      const existingEvents = this.getEventsData() || [];
      const updatedEvent = {
        ...eventData,
        createdAt: new Date(),
      };
      
      const eventIndex = existingEvents.findIndex(e => e.name === eventData.name);
      if (eventIndex >= 0) {
        existingEvents[eventIndex] = { ...existingEvents[eventIndex], ...updatedEvent };
      } else {
        existingEvents.push(updatedEvent as EventData);
      }
      
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(existingEvents));
      return true;
    } catch (error) {
      console.error('Failed to save event data:', error);
      return false;
    }
  }

  getEventsData(): EventData[] | null {
    try {
      const data = localStorage.getItem(this.EVENTS_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((event: any) => ({
        ...event,
        createdAt: new Date(event.createdAt)
      }));
    } catch (error) {
      console.error('Failed to get events data:', error);
      return null;
    }
  }

  // App State Management
  saveAppState(state: any): boolean {
    try {
      localStorage.setItem(this.APP_STATE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Failed to save app state:', error);
      return false;
    }
  }

  getAppState(): any | null {
    try {
      const data = localStorage.getItem(this.APP_STATE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get app state:', error);
      return null;
    }
  }

  // Utility Methods
  clearUserData(): boolean {
    try {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.APP_STATE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear user data:', error);
      return false;
    }
  }

  clearAllData(): boolean {
    try {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.EVENTS_KEY);
      localStorage.removeItem(this.APP_STATE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }

  exportData(): string | null {
    try {
      const userData = this.getUserData();
      const eventsData = this.getEventsData();
      const appState = this.getAppState();
      
      return JSON.stringify({
        userData,
        eventsData,
        appState,
        exportDate: new Date()
      }, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.userData) {
        this.saveUserData(data.userData);
      }
      
      if (data.eventsData && Array.isArray(data.eventsData)) {
        localStorage.setItem(this.EVENTS_KEY, JSON.stringify(data.eventsData));
      }
      
      if (data.appState) {
        this.saveAppState(data.appState);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

export const storage = new StorageManager();