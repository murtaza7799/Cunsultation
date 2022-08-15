import {
  Box,
  Button,
  IconButton,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import React from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';
import { initMakeRequest } from 'unsplash-js/dist/helpers/request';

const FilterModel = ({ setFilters }) => {
  //   const dispatch = useDispatch();
  const filter = [
    {
      name: 'Clear Filters',
      filter: null
    },
    {
      name: 'Relating',
      filter: 'Relating'
    },
    {
      name: 'Discovering',
      filter: 'Discovering'
    },
    {
      name: 'Examination',
      filter: 'Examination'
    },
    {
      name: 'Treatment',
      filter: 'Treatment'
    }
  ];
  const handleClick = async (filter) => {
    // console.log('filter', filter.filter);
    // setFilters(filter.filter);
    setFilters(filter.filter);
  };

  return (
    <Box display={'flex'}>
      <Menu>
        <MenuButton
          height={'25px'}
          as={IconButton}
          aria-label="Options"
          icon={<BsFilter />}
          variant="solid"></MenuButton>
        <MenuList padding="5px">
          {filter.map((item, index) => (
            <MenuItem
              bg={item.name}
              marginBottom="5px"
              key={index}
              icon={item.name === 'Clear Filters' ? <MdClear /> : null}
              onClick={() => handleClick(item)}>
              <Box minH="20px">{item.name}</Box>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
export default FilterModel;
