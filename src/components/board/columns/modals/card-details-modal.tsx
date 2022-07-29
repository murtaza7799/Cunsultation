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
  Badge
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
import { useReactToPrint } from 'react-to-print';
import FileSaver, { saveAs, FileSaverOptions } from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';
import * as quillToWord from 'quill-to-word';
type Props = {
  onClose: () => void;
  isOpen: boolean;
  card: CardDetail;
};

const CardDetailsModal: FC<Props> = ({ onClose, isOpen, card }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(card?.title);
  const [description, setDescription] = useState(card?.description);
  const [assigned, assignUser] = useState(card?.assignedTo);
  const [qilldata, setQillData] = useState();
  const cardRequest = useAppSelector((state) => state.cards.isRequesting);
  const cardDelete = useAppSelector((state) => state.cards.isDeleting);
  const users = useAppSelector((state) => state.users.users);

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
      assignedTo: assigned
    };
    console.log('description');
    console.log(description);

    await dispatch(updateCard(data));
    await dispatch(fetchCards());

    onClose();
  };

  const handleClick = async (data) => {
    console.log(qilldata);
    // assignUser(userId);
    // const data = {
    //   _id: card._id,
    //   title,
    //   description,
    //   columnId: card.columnId,
    //   assignedTo: userId
    // };
    // await dispatch(updateCard(data));
  };
  const options: FileSaverOptions = {
    autoBom: false
  };
  const quillToWordConfig = {
    exportAs: 'blob'
  };
  const fileToBlob = async (file) =>
    new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });
  const saveAsWord = async () => {
    const data = await quillToWord.generateWord(qilldata, { exportAs: 'blob' });
    const blob = await fileToBlob(data);
    await saveAs(blob);
  };
  const saveAsPdf = async () => {
    const pdfAsBlob = await pdfExporter.generatePdf(qilldata); // converts to PDF
    await saveAs(pdfAsBlob, title);
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
          <MenuItem onClick={saveAsPdf}>Download as PDF</MenuItem>
          <MenuItem onClick={saveAsWord}>Download as Word</MenuItem>
          <MenuItem onClick={handlePrint}>Print</MenuItem>
        </MenuList>
      </Menu>
    );
  };

  return (
    <>
      <Modal size="xl" onClose={handleModalClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        {/* https://github.com/chakra-ui/chakra-ui/discussions/2676 */}
        <ModalContent maxW="64rem">
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
