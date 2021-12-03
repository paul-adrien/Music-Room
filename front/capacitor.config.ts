import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'music-room',
  webDir: 'www',
  bundledWebRuntime: false,
  overrideUserAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 8_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12D508',
  ios: {
    appendUserAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 8_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12D508',
    overrideUserAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 8_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12D508',
  },
  android: {
    appendUserAgent:
      'Mozilla/5.0 (Linux; Android 4.4.4; One Build/KTU84L.H4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.135 Mobile Safari/537.36',
    overrideUserAgent:
      'Mozilla/5.0 (Linux; Android 4.4.4; One Build/KTU84L.H4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.135 Mobile Safari/537.36',
  },
  plugins: {
    Keyboard: {
      resize: 'body' as any,
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
  cordova: {
    preferences: {
      OverrideUserAgent: 'Mozilla/5.0 Google',
    },
  },
};

export default config;
