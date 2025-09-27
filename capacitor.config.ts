import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5ae02a933cde4c1c95c9062da0020b3f',
  appName: 'IPX - Intelligent Participant Experience',
  webDir: 'dist',
  server: {
    url: 'https://5ae02a93-3cde-4c1c-95c9-062da0020b3f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4F46E5',
      showSpinner: true,
      spinnerColor: '#FFFFFF'
    }
  }
};

export default config;