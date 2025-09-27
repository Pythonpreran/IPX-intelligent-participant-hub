import { useState, useEffect } from "react";
import RoleSelection from "@/components/RoleSelection";
import ParticipantRegistration from "@/components/ParticipantRegistration";
import ParticipantDashboard from "@/components/ParticipantDashboard";
import CoordinatorDashboard from "@/components/CoordinatorDashboard";
import { storage, UserData } from "@/utils/storage";

type AppState = 'role-selection' | 'participant-registration' | 'participant-dashboard' | 'coordinator-dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Load existing user data and app state on mount
  useEffect(() => {
    const existingUserData = storage.getUserData();
    const existingAppState = storage.getAppState();
    
    if (existingUserData && existingAppState?.currentState) {
      setUserData(existingUserData);
      setAppState(existingAppState.currentState);
    }
  }, []);

  const handleRoleSelection = (role: 'participant' | 'coordinator') => {
    const newState = role === 'participant' ? 'participant-registration' : 'coordinator-dashboard';
    setAppState(newState);
    storage.saveAppState({ currentState: newState, lastRole: role });
  };

  const handleRegistrationComplete = (data: UserData) => {
    setUserData(data);
    const newState = 'participant-dashboard';
    setAppState(newState);
    storage.saveAppState({ currentState: newState, lastRole: 'participant' });
  };

  const handleBackToRoleSelection = () => {
    setAppState('role-selection');
    setUserData(null);
    storage.saveAppState({ currentState: 'role-selection' });
  };

  const handleLogout = () => {
    storage.clearUserData();
    setUserData(null);
    setAppState('role-selection');
  };

  return (
    <div className="min-w-full min-h-screen">
      {appState === 'role-selection' && (
        <RoleSelection onSelectRole={handleRoleSelection} />
      )}
      
      {appState === 'participant-registration' && (
        <ParticipantRegistration 
          onBack={handleBackToRoleSelection}
          onComplete={handleRegistrationComplete}
        />
      )}
      
      {appState === 'participant-dashboard' && userData && (
        <ParticipantDashboard userData={userData} />
      )}
      
      {appState === 'coordinator-dashboard' && (
        <CoordinatorDashboard />
      )}
    </div>
  );
};

export default Index;
