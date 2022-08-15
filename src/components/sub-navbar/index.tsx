import { Box, Heading, Avatar, Tooltip } from '@chakra-ui/react';

import PropType from 'prop-types';
import BoardSettings from '@/src/components/sub-navbar/board-settings';
import InviteModal from '@/src/components/sub-navbar/invite-user/modal';
import React, { useEffect } from 'react';
import { useAppSelector } from '@/src/hooks';
import { useDispatch } from 'react-redux';
import { fetchUsers } from '@/src/slices/users';

import UnsplashDrawer from '@/src/components/sub-navbar/unsplash-in-drawer';
import FilterModel from './filters';

const SubNavbar = ({ setFilters }): JSX.Element => {
  const board = useAppSelector((state) => state.board.board);
  const users = useAppSelector((state) => state.users.users);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMyAPI() {
      // console.log('fetching api');
      await dispatch(fetchUsers());
    }
    fetchMyAPI();
  }, []);

  const loadBoardUsers = () => {
    // users.map((user) => {
    //   // console.log(user.fullName);
    // });
    // console.log('load board users');
    return users.map((user, index) => (
      <Tooltip label={user.fullName} aria-label="A tooltip" key={index}>
        <Avatar size="sm" name={user.fullName} mr="5px" src="" />
      </Tooltip>
    ));
  };

  return (
    <Box
      w={'full'}
      h={'100vh'}
      backgroundSize={'cover'}
      backgroundPosition={'center center'}
      height="40px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bg="rgba(0,0,0,0.1)">
      <Heading ml="0.5rem" color="white" as="h2" size="sm" whiteSpace="nowrap" d="block">
        Patient Name: {board?.name}
      </Heading>
      <Box>{loadBoardUsers()}</Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <FilterModel setFilters={setFilters} />
        <Box>
          <InviteModal />
          <BoardSettings />
          <UnsplashDrawer />
        </Box>
      </Box>
    </Box>
  );
};

SubNavbar.propTypes = {
  board: PropType.object
};

export default SubNavbar;
