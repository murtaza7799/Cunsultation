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
              fontSize={['40px', '40px', '40px', '40px']}
              fontWeight="bold"
              lineHeight="50px"
              colorScheme={'white.300'}
              bg={{ boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.5)' }}
              textShadow={'40px 40px 60px rgba(0, 0, 0, 0.5)'}
              textDecoration="yellowgreen"
              color={'white'}>
              Organize your consultation notes, from text, sketches, label your consultation
              experience with AI-based tools
            </Text>
            <Text
              fontWeight={700}
              lineHeight={1.2}
              marginInline="1rem"
              color={'white'}
              shadow="lg"
              bg={{ boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.5)' }}
              textShadow={'40px 40px 60px rgba(0, 0, 0, 0.5)'}
              textDecoration="yellowgreen"
              colorScheme={'white.300'}
              fontSize={['1rem', '1rem', '1.5rem', '1.5rem']}
              width={['100%', '100%', '50%', '50%']}>
              Notes seem to be one of the most underestimated tasks for physicians during and after
              consultation. Rooks makes it digitally and virtually easy to produce notes right after
              consultation, especially with voice-to-text and other writing tools to ease the
              process.
            </Text>
          </Box>
          <Box>
            <Image maxWidth={400} maxHeight={400} src="/doctor.png" alt="brand logo"></Image>
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
