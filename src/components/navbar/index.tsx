import React, { FC } from 'react';
import { Button, Image, Flex, Box, Spacer, Text } from '@chakra-ui/react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useAppSelector } from '@/src/hooks';
import { GrLogout } from 'react-icons/gr';
import { auth } from '@/util/firebase';

type IProps = {
  bg?: string;
};

const NavBar: FC<IProps> = ({ bg }) => {
  const user = useAppSelector((state) => state.user);

  const logout = async () => {
    const URL = '/api/logout';

    const response = await fetch(URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({})
    });

    const responseInJson = await response.json();

    if (responseInJson.message === 'success') {
      window.location.href = `${window.location.origin}/login`;
    }
  };

  const renderButtons = () => {
    if (user?.isValid) {
      return (
        <Button fontSize="20" m="4" float="right" mr="4" pr="4" onClick={logout}>
          <GrLogout />
        </Button>
      );
    }

    return (
      <>
        <Button fontSize="md" float="right" m="4" bg={'gray.200'} color={'gray.800'}>
          <Link href="/login">Log in</Link>
        </Button>
        <Button
          fontSize="md"
          color="white"
          m="4"
          bgGradient="linear(to-r, red.400,pink.400)"
          _hover={{
            bgGradient: 'linear(to-r, red.400,pink.400)',
            boxShadow: 'xl'
          }}>
          <Link href="/signup">Sign up</Link>
        </Button>
      </>
    );
  };

  return (
    <Box boxShadow="md" borderWidth="1px">
      <Flex>
        {/* <Image height="8" src="/trello-logo.svg" alt="brand logo" m="5"></Image> */}
        <Text fontSize="lg" fontWeight="bold" m="5" color={'white'}>
          ROOKS
        </Text>
        <Spacer />
        {renderButtons()}
      </Flex>
    </Box>
  );
};

NavBar.propTypes = {
  bg: PropTypes.string
};

export default NavBar;
