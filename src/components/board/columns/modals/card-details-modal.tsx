/* eslint-disable no-var */
import React, { FC, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Button,
  Input,
  ModalOverlay,
  Text,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Badge,
  ModalCloseButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { CardDetail } from '@/src/types/cards';
import { deleteCard, fetchCards, updateCard } from '@/src/slices/cards';
import { useAppSelector } from '@/src/hooks';
import { AiOutlineDelete, AiOutlineClose, AiOutlineLaptop } from 'react-icons/ai';
import { GrTextAlignFull } from 'react-icons/gr';
import CardLabel from '@/src/components/board/columns/modals/card-labels-menu';
import QuillEditor from '@/src/components/quill-editor';
import { AiOutlineDown } from 'react-icons/ai';
import { saveAs } from 'file-saver';
const quillToWord = typeof window === 'object' ? require('quill-to-word') : () => false;
import { useReactToPrint } from 'react-to-print';
import PDFDocument from './pdf';
type Props = {
  onClose: () => void;
  isOpen: boolean;
  card: CardDetail;
};

const CardDetailsModal: FC<Props> = ({ onClose, isOpen, card }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(card?.title);
  const [description, setDescription] = useState(card?.description);
  const [qilldata, setQillData] = useState();
  const cardRequest = useAppSelector((state) => state.cards.isRequesting);
  const cardDelete = useAppSelector((state) => state.cards.isDeleting);
  const [inputList, setInputList] = React.useState(
    card?.questions?.map((question) => {
      return {
        value: question.value,
        checked: question.checked
      };
    })
  );
  const [quillText, setQuillText] = React.useState('');
  const toast = useToast();
  const handleCardDelete = async () => {
    await dispatch(deleteCard(card._id));
    await dispatch(fetchCards());

    onClose();
  };
  const handleModalClose = async () => {
    const data = {
      _id: card._id,
      title,
      description,
      columnId: card.columnId,
      questions: inputList
    };

    await dispatch(updateCard(data));
    await dispatch(fetchCards());

    onClose();
  };

  const copyQuillText = () => {
    const text = quillText;
    navigator.clipboard.writeText(text);
    toast({
      position: 'bottom',
      description: 'Copy to Clipboard',
      status: 'success',
      duration: 2500,
      isClosable: true
    });
  };

  const saveAsWord = async () => {
    try {
      const data = await quillToWord.generateWord(qilldata, {
        exportAs: 'blob'
      });
      await saveAs(data, title);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePrint = useReactToPrint({
    content: () => stringToHTML(description)
  });
  const stringToHTML = function (str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  };
  const assignToMenu = () => {
    return (
      <Menu>
        <MenuButton as={Button} size="xs" rightIcon={<AiOutlineDown />}>
          Share
        </MenuButton>
        <MenuList>
          <MenuItem onClick={saveAsWord}>Save as Word</MenuItem>
          {renderDocument()}
          <MenuItem onClick={handlePrint}>Print</MenuItem>
          <MenuItem onClick={copyQuillText}>Copy</MenuItem>
        </MenuList>
      </Menu>
    );
  };

  const renderDocument = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <Box>
        <MenuItem onClick={onOpen}>Save as PDF</MenuItem>
        <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior={'inside'}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <PDFDocument description={description} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };

  return (
    <>
      <Modal
        size="xl"
        onClose={handleModalClose}
        isOpen={isOpen}
        isCentered
        scrollBehavior={'inside'}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
        {/* https://github.com/chakra-ui/chakra-ui/discussions/2676 */}
        <ModalContent display="flex" maxW="64rem">
          <ModalBody>
            {card.label && (
              <Badge bg={card.label.type} color="white">
                {card.label.type}
              </Badge>
            )}
            <Box display="flex" marginTop="1rem">
              <AiOutlineLaptop />
              <Input
                name="title"
                size="sm"
                marginLeft="1rem"
                value={title}
                fontWeight="bold"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Card title"
              />
            </Box>
            <Box display="flex">
              <Box width="90%" marginTop="2rem">
                <Box display="flex" fontWeight="bold">
                  <GrTextAlignFull />
                  <Text marginLeft="1rem">Description</Text>
                </Box>
                <Box marginLeft="1.5rem" minHeight="200px" width="auto">
                  <QuillEditor
                    value={description}
                    onChange={setDescription}
                    quillContent={setQillData}
                    inputList={inputList}
                    setInputList={setInputList}
                    quillText={setQuillText}
                  />
                </Box>
              </Box>
              <Box display="flex" flexDirection="column">
                <CardLabel id={card._id} boardId={card.boardId} />
                {assignToMenu()}
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              size="xs"
              marginRight="1rem"
              onClick={handleCardDelete}
              disabled={cardDelete}
              isLoading={cardDelete}
              loadingText="Deleting"
              bg="red.500"
              color="white"
              _hover={{
                backgroundColor: 'red.600'
              }}>
              <AiOutlineDelete />
            </Button>
            <Button
              size="xs"
              onClick={handleModalClose}
              disabled={cardRequest}
              isLoading={cardRequest}
              loadingText="Updating">
              <AiOutlineClose /> Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CardDetailsModal;
