import React from 'react';
import { Box, ChakraProvider, extendTheme, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import '@/src/styles/default.css';
import PropTypes from 'prop-types';
import Head from 'next/head';
import NextNprogress from 'nextjs-progressbar';
import 'regenerator-runtime/runtime';
import 'nprogress/nprogress.css';
import Script from 'next/script';
// import initAuth from '@/util/initAuth';

// // the module you created above
// initAuth();

const theme = extendTheme({
  colors: {
    brand: '#0079bf',
    success: '#70b500',
    danger: '#eb5a46',
    info: '#ff9f1a',
    warning: '#f2d600',
    darkblue: '#FFFFFF',
    lightblue: '#FFFFFF',
    performance: '#0079bf',
    bug: '#eb5a46',
    feature: '#61bd4f',
    information: '#ff9f1a'
  }
});

const TrelloApp = ({ Component, pageProps }) => {
  return (
    <Box
      w={'full'}
      h={'100vh'}
      backgroundImage={
        'url(https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
      }
      backgroundSize={'cover'}
      backgroundPosition={'center center'}>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-37RZ1NCX0S"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', ''G-37RZ1NCX0S'');
        `}
      </Script>
      <Head>
        <title>ROOKS</title>
        <link rel="shortcut icon" href="/logo.png"></link>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NextNprogress color="#70b500" startPosition={0.3} stopDelayMs={200} height={4} />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Box>
  );
};

TrelloApp.propTypes = {
  pageProps: PropTypes.object
};

export default TrelloApp;
