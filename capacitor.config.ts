/*import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: '05-Trip-Quest-App',
  webDir: 'www'
};

export default config;
*/

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tripquest.app',
  appName: 'Trip Quest',
  webDir: 'www',
  plugins: {
    GoogleMaps: {
      key: 'AIzaSyB0QMpsgHjavlbzJshLAHRVrzDHZ6p7DlM', // replace after regenerating/restricting
    },
  },
};

export default config;
