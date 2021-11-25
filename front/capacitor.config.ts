import { CapacitorConfig } from '@capacitor/cli';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'music-room',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Native,
    },
  },
};

export default config;
