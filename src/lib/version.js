import store from '../store/store';
import axios from 'axios';
import { UPDATE_APP_VERSION } from 'AppConstants';

const WAIT_TIME = window.APP_ENV !== 'production'
  ? 60000     // 1 minute in dev
  : 1800000;  // 30 minutes in prod

//TODO: MH REMOVE:
// export default async function detectVersionChange() {
//   const { data: currentVersion } = await axios.get('/version.txt');
//
//   if (typeof __DEV__ !== 'undefined' && __DEV__) {
//     console.info(`Current version: ${currentVersion}`);
//   }
//
//   store.dispatch({
//     type: UPDATE_APP_VERSION,
//     payload: currentVersion.trim()
//   });
//
//   setInterval(async () => {
//     const { data: newVersion } = await axios.get('/version.txt');
//     const { version } = store.getState();
//
//     if (version !== newVersion.trim()) {
//       if (typeof __DEV__ !== 'undefined' && __DEV__) {
//         console.info('Version changed');
//         console.info(`Current version: ${newVersion}`);
//       }
//
//       store.dispatch({
//         type: UPDATE_APP_VERSION,
//         payload: newVersion.trim()
//       });
//     }
//   }, WAIT_TIME);
// }


export class TipHiveVersionManager {

  version: null

  constructor( messenger ) {
    this.messenger = messenger;
    this.setVersion();
    setInterval(() => {
      this.checkVersion();
    }, WAIT_TIME)
  }

  setVersion = async() => {
    const { data: version } = await axios.get('/version.txt');
    this.version = version;
  }

  checkVersion = async() => {
    const { data: newVersion } = await axios.get('/version.txt');
    if ( newVersion !== this.version ) {
      const msg = this.messenger().post({
        id: 'reload-dialog',
        singleton: true,
        message: 'A new version has been detected. Do you want to reload?',
        hideAfter: 60 * 60 * 24, // hide after 24 hours ಠ_ಠ
        actions: {
          ok: {
            label: 'Reload now',
            action: () => window.location.reload(true)
          },
          cancel: {
            label: 'Cancel',
            action: () => msg.cancel()
          }
        }
      });
    }
  };
}
