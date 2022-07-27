import Login from '@/src/components/login';
import { setOrGetStore } from '@/util/initialise-store';
import withStore from '@/src/hoc/with-store';
import isValidUser from '@/util/is-valid-user';
import isUserAuth from './services/userValidity';
import router from 'next/router';

const LoginPageWithStore = withStore(Login);

LoginPageWithStore.getInitialProps = async (ctx) => {
  console.log('LoginPageWithStore getInitialProps');
  const reduxStore = setOrGetStore();
  const user = await isUserAuth();
  const userDetails = await isValidUser();
  console.log('userDetails is User Auth');
  console.log(user);
  console.log('Check User Details at  ', reduxStore.getState());

  if (user !== null) {
    console.log('User is valid Valid valid valid');
    router.push('/boards');
    // ctx.res.writeHead(307, {
    //   Location: '/home'
    // });
    // ctx.res.end();
  }
  // console.log('userDetails', reduxStore.getState());

  return {
    reduxState: reduxStore.getState()
  };
};

export default LoginPageWithStore;
