import React from 'react';
import { Box } from '@chakra-ui/react';
import { setOrGetStore } from '@/util/initialise-store';
const Boards = (): JSX.Element => {
  const reduxStore = setOrGetStore();
  const { dispatch } = reduxStore;
  console.log('Boards');
  console.log(reduxStore.getState());
  return (
    <Box minHeight="50vh" flexGrow={3} mx="2%" boxShadow="base" rounded="lg" bg="white" p="1rem">
      <h1>Welcome </h1>
      <h1>Please Visit Board Section to Add boards </h1>
    </Box>
  );
};

export default Boards;
