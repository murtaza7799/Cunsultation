import React, { Component } from 'react';
import { setOrGetStore } from '@/util/initialise-store';
import { updateUserData, fetchUser } from '@/src/slices/user';
import isUserAuth from '../components/services/userValidity';

const WithAuth = (App) => {
  return class AppWithAuth extends Component {
    constructor(props) {
      super(props);
    }
    static async getInitialProps(ctx) {
      let appProps = {};
      console.log('UserAuth at auth' + isUserAuth());
      const reduxStore = setOrGetStore();
      const { dispatch } = reduxStore;
      const user = await isUserAuth();
      if (user !== null) {
        dispatch(updateUserData({ type: 'isValid', value: true }));
        dispatch(updateUserData({ type: 'id', value: user['uid'] }));
        dispatch(updateUserData({ type: 'email', value: user['email'] }));
        dispatch(updateUserData({ type: 'fullName', value: 'TEst Name' }));
        dispatch(fetchUser());
        appProps = {
          reduxState: reduxStore.getState()
        };
      } else {
        console.log('User is null');
        dispatch(updateUserData({ type: 'isValid', value: false }));
        dispatch(fetchUser());
        appProps = {
          reduxState: reduxStore.getState()
        };
        ctx.res.writeHead(307, {
          Location: '/login'
        });

        ctx.res.end();
      }

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }
      // await dispatch(updateUserData({ type: 'isValid', value: true }));
      // await dispatch(updateUserData({ type: 'id', value: userDetails && userDetails.id }));
      // await dispatch(fetchUser());

      ctx.reduxState = reduxStore.getState();
      console.log('ctx.reduxState', reduxStore.getState());
      return {
        ...appProps
      };
    }

    render() {
      return <App />;
    }
  };
};

export default WithAuth;
