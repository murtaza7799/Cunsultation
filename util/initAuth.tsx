import { init } from 'next-firebase-auth';

const initAuth = () => {
  init({
    authPageURL: '/auth',
    appPageURL: '/',
    loginAPIEndpoint: '/api/login', // required
    logoutAPIEndpoint: '/api/logout', // required
    onLoginRequestError: (err) => {
      console.error(err);
    },
    onLogoutRequestError: (err) => {
      console.error(err);
    },
    firebaseAuthEmulatorHost: 'localhost:9099',
    firebaseAdminInitConfig: {
      credential: {
        projectId: 'clientproject-6aeff',
        clientEmail: 'firebase-adminsdk-gqt9z@clientproject-6aeff.iam.gserviceaccount.com',
        // The private key must not be accessible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY
      },
      databaseURL: 'https://clientproject-6aeff-default-rtdb.firebaseio.com'
    },
    // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
      apiKey: 'AIzaSyDnR4jVplbcDuwkVW8mRptyRP42Z1vfxPA',
      authDomain: 'clientproject-6aeff.firebaseapp.com',
      projectId: 'clientproject-6aeff',
      storageBucket: 'clientproject-6aeff.appspot.com',
      messagingSenderId: '908410256076',
      appId: '1:908410256076:web:810ff56f02974656c36069',
      measurementId: 'G-7NXX8ELP86'
    },
    cookies: {
      name: 'ExampleApp', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [process.env.COOKIE_SECRET_CURRENT, process.env.COOKIE_SECRET_PREVIOUS],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true
    },
    onVerifyTokenError: (err) => {
      console.error(err);
    },
    onTokenRefreshError: (err) => {
      console.error(err);
    }
  });
};

export default initAuth;
