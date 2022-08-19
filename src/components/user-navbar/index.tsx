import React, { FC } from 'react';
import {
  Button,
  Box,
  Spacer,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Text,
  Badge,
  Image
} from '@chakra-ui/react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useAppSelector } from '@/src/hooks';
import { AiOutlineHome } from 'react-icons/ai';
import { SiTrello } from 'react-icons/si';
import * as auth from '../services/auth';
import checkEnvironment from '@/util/check-environment';

const UserNavBar: FC = () => {
  const user = useAppSelector((state) => state.user);

  const logout = async () => {
    await auth.logout();

    const url = `/api/logout`;

    const response = await fetch(url, {
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
    // console.log(user?.fullName);
    if (user?.isValid) {
      return (
        <>
          <Box ml="3">
            <Text color="white" fontWeight="bold">
              Dr. {user?.fullName}
            </Text>
            <Text color="white" fontSize="sm">
              {user?.email}
            </Text>
          </Box>
          <Menu>
            <MenuButton size="xs" mr="5px">
              <Avatar size="sm" name={user?.fullName} color="white" />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </>
      );
    }

    return (
      <>
        <Button fontSize="20" color="brand" variant="link" float="right" mr="2" pr="2">
          <Link href="/login">Log in</Link>
        </Button>
        <Button fontSize="md" colorScheme="green" color="white" m="4">
          <Link href="/signup">Sign up</Link>
        </Button>
      </>
    );
  };

  return (
    <Box boxShadow="lg" bg="rgba(0,0,0,0.2)" display="flex " borderWidth="1px" overflow="auto">
      <Link href="/boards">
        <Button size="xs" ml="5px" mr="10px" my="8px">
          Consultations
        </Button>
      </Link>
      <Spacer />
      <Image height="6" src="/brandname.png" alt="brand logo" m="3"></Image>

      <Spacer />
      {renderButtons()}
    </Box>
  );
};

UserNavBar.propTypes = {
  bg: PropTypes.string
};

export default UserNavBar;
