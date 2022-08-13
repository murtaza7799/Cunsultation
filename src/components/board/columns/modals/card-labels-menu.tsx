import React, { FC } from 'react';
import {
  Button,
  Text,
  Box,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { MdLabelOutline } from 'react-icons/md';
import { updateCard } from '@/src/slices/cards';
import { useDispatch } from 'react-redux';
import { Label } from '@/src/types/cards';

type IProps = {
  id: string;
  boardId: string;
};

const cardLabels = [
  {
    type: 'Relating',
    bg: 'red'
  },
  {
    type: 'Discovering',
    bg: 'orange'
  },
  {
    type: 'Examination',
    bg: 'yellow'
  },
  {
    type: 'Treatment',
    bg: 'green'
  }
];

const CardLabel: FC<IProps> = ({ id, boardId }) => {
  const dispatch = useDispatch();

  const handleClick = async (label: Label) => {
    const data = {
      _id: id,
      boardId,
      label
    };

    await dispatch(updateCard(data));
  };

  return (
    <ListItem>
      <Menu>
        <MenuButton w={'full'} whiteSpace="nowrap" h={'25px'} as={Button}>
          Labels
        </MenuButton>
        <MenuList padding="5px">
          {cardLabels.map((item, index) => (
            <MenuItem bg={item.bg} marginBottom="5px" key={index} onClick={() => handleClick(item)}>
              <Box minH="20px">{item.type}</Box>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </ListItem>
  );
};

export default CardLabel;
