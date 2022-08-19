import React, { FC } from 'react';
import { Box, Badge, Button, Tooltip } from '@chakra-ui/react';
import { Draggable } from 'react-beautiful-dnd';
import { CardDetail } from '@/src/types/cards';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/src/hooks';
import { deleteCard, fetchCards, updateCard } from '@/src/slices/cards';
import { AiOutlineDelete } from 'react-icons/ai';

type Props = {
  showCardDetail: (cardId: string) => void;
  cardIndex: number;
  card: CardDetail;
};

const Card: FC<Props> = ({ cardIndex, showCardDetail, card }) => {
  const dispatch = useDispatch();
  const cardDelete = useAppSelector((state) => state.cards.isDeleting);
  const handleCardDelete = async () => {
    await dispatch(deleteCard(card._id));
    await dispatch(fetchCards());
  };
  // const users = useAppSelector((state) => state.users.users);

  // const loadAssignedToUser = () => {
  //   if (!card.assignedTo) return;

  //   const user = users.filter((user) => user._id === card.assignedTo);

  //   return (
  //     <Box display="flex" justifyContent="flex-end">
  //       <Avatar size="xs" name={user[0]?.fullName} />
  //     </Box>
  //   );
  // };

  return (
    // https://github.com/atlassian/react-beautiful-dnd/issues/1767
    <Draggable draggableId={card._id} index={cardIndex} key={card._id}>
      {(provided) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          m="5px"
          p="10px"
          id={card._id}
          _hover={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
          minHeight="80px"
          borderWidth="1px"
          bg="white"
          cursor="pointer"
          borderRadius="md"
          overflow="auto">
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button colorScheme={'gray'} size="xs" onClick={() => showCardDetail(card._id)}>
              Edit
            </Button>
            <br />
            <Button
              size="xs"
              marginLeft={2}
              colorScheme={'red'}
              onClick={handleCardDelete}
              disabled={cardDelete}
              isLoading={cardDelete}
              loadingText="Deleting"
              bg="red.500">
              <AiOutlineDelete />
            </Button>
          </Box>
          {card.label && (
            <Box display={'auto'}>
              <Badge h={5} bg={card.label.bg} color="white">
                {card.label.type}
              </Badge>
            </Box>
          )}
          <p>{card.title}</p>
          {/* {loadAssignedToUser()} */}
        </Box>
      )}
    </Draggable>
  );
};

export default Card;
