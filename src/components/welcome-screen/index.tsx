import React from 'react';
import NavBar from '@/src/components/navbar';
import { Box, Image, Flex, Text } from '@chakra-ui/react';

const WelcomeScreen = (): JSX.Element => {
  return (
    <>
      <Box
        backdropfilter="blur(10px) hue-rotate(90deg)"
        backdropBlur="200px"
        height="100vh"
        w={'full'}
        h={'100vh'}
        backgroundSize={'cover'}
        backgroundPosition={'center center'}>
        <NavBar />
        <Flex
          alignItems="center"
          flexDirection={['column', 'column', 'row', 'row']}
          justifyContent="center"
          p="4rem">
          <Box>
            <Text
              fontSize={['50px', '50px', '50px', '50px']}
              fontWeight="bold"
              colorScheme={'white.300'}
              lineHeight="50px"
              color={'white'}>
              We helps People to move Forward.
            </Text>
            <Text
              fontWeight={700}
              lineHeight={1.2}
              color={'white'}
              colorScheme={'red.100'}
              fontSize={['1rem', '1rem', '1.5rem', '1.5rem']}
              width={['100%', '100%', '50%', '50%']}>
              Collaborate, manage patients, and reach new productivity peaks. From high rises to the
              home, the way your people works is unique - accomplish it all with our Platform.
            </Text>
          </Box>
          <Box>
            <Image
              height={['200px', '300px', '400px', '500px']}
              src="/homepage/home-illustration.svg"
              alt="brand logo"></Image>
          </Box>
        </Flex>
      </Box>
      <Box m={'4'}>
        <Text fontSize={'md'} textAlign={'center'}>
          © 2022 ROOKS All rights reserved
        </Text>
      </Box>
    </>
  );
};

export default WelcomeScreen;
