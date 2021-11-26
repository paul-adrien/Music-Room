import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'music-room',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: 'body' as any,
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
