import React from 'react';
import NavBar from '@/src/components/navbar';
import { Box, Image, Flex, Text, Stack, Heading, Link, Button } from '@chakra-ui/react';

const WelcomeScreen = (): JSX.Element => {
  return (
    <Box bg={'gray.100'}>
      <NavBar />
      <Flex
        align="center"
        justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
        direction={{ base: 'column-reverse', md: 'row' }}
        minH="70vh"
        px={8}
        mb={16}>
        <Stack
          spacing={4}
          w={{ base: '80%', md: '40%' }}
          align={['center', 'center', 'flex-start', 'flex-start']}>
          <Heading
            as="h2"
            size="xl"
            fontWeight="bold"
            color="primary.800"
            textAlign={['center', 'center', 'center', 'left']}>
            Tired of having too many notes or follow-up for your patients after consultation? We get
            it!
          </Heading>
          <Heading
            as="h2"
            size="md"
            color="primary.800"
            opacity="0.8"
            fontWeight="normal"
            lineHeight={1.5}
            textAlign={['center', 'center', 'left', 'left']}>
            Notes seem to be one of the most underestimated tasks for physicians during and after
            consultation. Rooks makes it digitally and virtually easy to produce notes right after
            consultation, especially with voice-to-text and other writing tools to ease the process
          </Heading>
        </Stack>
        <Box>
          {/* TODO: Make this change every X secs */}
          <Image
            marginLeft={'40%'}
            src={'/doctor.png'}
            rounded="2rem"
            border={'2px solid #fff'}
            w={'440px'}
            h={'440px'}
            m={'25px'}
            shadow="2xl"
          />
        </Box>
      </Flex>
      <hr />
      <Flex
        align="center"
        justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
        direction={{ base: 'column-reverse', md: 'row' }}
        minH="70vh"
        px={16}
        mb={16}>
        <Box>
          {/* TODO: Make this change every X secs */}
          <Image
            marginLeft={'40%'}
            src={'/doctor1.png'}
            rounded="2rem"
            border={'2px solid #fff'}
            w={'440px'}
            h={'440px'}
            m={'15px'}
            shadow="2xl"
          />
        </Box>
        <Stack
          spacing={3}
          w={{ base: '80%', md: '40%' }}
          align={['center', 'center', 'flex-start', 'flex-start']}>
          <Heading
            as="h2"
            size="xl"
            fontWeight="bold"
            color="primary.800"
            textAlign={['center', 'center', 'center', 'left']}>
            Organize your consultation notes, from text, sketches, label your consultation
            experience with AI-based tools.
          </Heading>
          {/* <Heading
            as="h2"
            size="md"
            color="primary.800"
            opacity="0.8"
            fontWeight="normal"
            lineHeight={1.5}
            textAlign={['center', 'center', 'left', 'left']}>
            Notes seem to be one of the most underestimated tasks for physicians during and after
            consultation. Rooks makes it digitally and virtually easy to produce notes right after
            consultation, especially with voice-to-text and other writing tools to ease the process
          </Heading> */}
        </Stack>
      </Flex>
      <hr />
      <Box m={'5'}>
        <Text fontSize={'md'} textAlign={'center'} m="4">
          © 2022 ROOKS All rights reserved
        </Text>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;
