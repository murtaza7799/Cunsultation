import WelcomeScreen from '@/src/components/welcome-screen';
import withStore from '@/src/hoc/with-store';
import withAuth from '@/src/hoc/with-auth';
import { setOrGetStore } from '@/util/initialise-store';
import isValidUser from '@/util/is-valid-user';
const WelcomeScreenWithStoreWithStore = withStore(WelcomeScreen);
WelcomeScreenWithStoreWithStore.getInitialProps = async (ctx) => {
  const reduxStore = setOrGetStore();
  const userDetails = isValidUser(ctx);

  if (userDetails && userDetails.isValid) {
    ctx.res.writeHead(307, {
      Location: '/boards'
    });

    ctx.res.end();
  }

  return {
    reduxState: reduxStore.getState()
  };
};
export default WelcomeScreenWithStoreWithStore;
