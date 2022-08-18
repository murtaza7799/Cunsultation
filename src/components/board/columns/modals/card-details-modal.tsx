/* eslint-disable no-var */
/* eslint-disable prefer-const */
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
  useToast,
  List,
  ListItem,
  Image,
  Grid,
  GridItem,
  SimpleGrid
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
import LocalImages from '@/src/components/quill-editor/images';
import { useQuill } from 'react-quilljs';
import InsertCheckBox from '@/src/components/quill-editor/DynamicCheckbox';
import { useRef } from 'react';
import { ComponentToPrint } from './ComponentToPrint';
import html2pdf from 'html2pdf.js';
import { AlignAction, DeleteAction, ImageSpec } from 'quill-blot-formatter';
import Resizer from 'react-image-file-resizer';
type Props = {
  onClose: () => void;
  isOpen: boolean;
  card: CardDetail;
};
class CustomImageSpec extends ImageSpec {
  getActions() {
    return [AlignAction, DeleteAction, ...super.getActions()];
  }
}
const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
      'PNG',
      50,
      0,
      (uri) => {
        resolve(uri);
      },
      'base64'
    );
  });
const CardDetailsModal: FC<Props> = ({ onClose, isOpen, card }) => {
  function toDataURL(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      resizeFile(xhr.response).then((uri) => {
        callback(uri);
      });
    };
    xhr.send();
  }

  // const xhr = new XMLHttpRequest();
  // xhr.onload = function () {
  //   const reader = new FileReader();
  //   reader.onloadend = function () {
  //     callback(reader.result);
  //   };
  //   reader.readAsDataURL(xhr.response);
  // };
  // xhr.open('GET', url);
  // xhr.responseType = 'blob';
  // xhr.send();
  // }
  if (typeof window !== 'undefined') {
    const { quill, quillRef, Quill } = useQuill({
      modules: {
        blotFormatter: {
          specs: [CustomImageSpec],
          overlay: {
            style: {
              border: '1px solid black',
              position: 'absolute',
              boxSizing: 'border-box'
            },
            align: {
              attribute: 'data-align',
              aligner: {
                applyStyle: true
              }
            }
          }
        }
      }
    });
    const dispatch = useDispatch();
    const [title, setTitle] = useState(card?.title);
    const [description, setDescription] = useState(card?.description);
    const [qilldata, setQillData] = useState();
    const cardRequest = useAppSelector((state) => state.cards.isRequesting);
    const cardDelete = useAppSelector((state) => state.cards.isDeleting);
    const board = useAppSelector((state) => state.board.board);
    const user = useAppSelector((state) => state.user);
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

    // const saveAsWord = async () => {
    //   try {
    //     const data = await quillToWord.generateWord(qilldata, {
    //       exportAs: 'blob'
    //     });
    //     await saveAs(data, title);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current
    });
    const handleDownloadWord = useReactToPrint({
      onPrintError: (error) => console.log(error),
      content: () => componentRef.current,
      removeAfterPrint: true,
      print: async (printIframe) => {
        const document = printIframe.contentDocument;
        if (document) {
          const html = document.getElementsByTagName('html')[0].innerHTML;
          const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
          const fileDownload = document.createElement('a');
          document.body.appendChild(fileDownload);
          fileDownload.href = source;
          fileDownload.download = title + '.doc';
          fileDownload.click();
          document.body.removeChild(fileDownload);
        }
      }
    });
    const handleDownloadPDF = useReactToPrint({
      onPrintError: (error) => console.log(error),
      content: () => componentRef.current,
      removeAfterPrint: true,
      print: async (printIframe) => {
        const document = printIframe.contentDocument;
        if (document) {
          const html = document.getElementsByTagName('html')[0];
          const exporter = new html2pdf(html);
          await exporter.getPdf(true);
        }
      }
    });

    const assignToMenu = () => {
      const { isOpen, onOpen, onClose } = useDisclosure();
      return (
        <Box
          width={'200px'}
          height={'150px'}
          display="flex"
          flexDirection="column"
          border={'1px'}
          bg={'gray.50'}
          borderColor="gray.300">
          <List spacing={1}>
            <ListItem>
              <Text alignContent={'center'} align={'center'} color={'black'}>
                Share
              </Text>
            </ListItem>
            <ListItem>
              <Box>
                <Menu>
                  <MenuItem
                    as={Button}
                    bg={'gray.200'}
                    color={'gray.800'}
                    w={'full'}
                    border="1px"
                    borderColor="gray.300"
                    _hover={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
                    h={'25px'}
                    onClick={handleDownloadPDF}>
                    Save as PDF
                  </MenuItem>
                  <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior={'inside'}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalCloseButton />
                      <ModalBody>
                        <PDFDocument description={description} />
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </Menu>
              </Box>
            </ListItem>
            <ListItem>
              <Button
                fontFamily={'heading'}
                bg={'gray.200'}
                color={'gray.800'}
                border="1px"
                borderColor="gray.300"
                _hover={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
                w={'full'}
                h={'25px'}
                onClick={handleDownloadWord}>
                Download As Word
              </Button>
            </ListItem>
            <ListItem>
              <Box>
                <Button
                  fontFamily={'heading'}
                  bg={'gray.200'}
                  color={'gray.800'}
                  border="1px"
                  borderColor="gray.300"
                  _hover={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
                  w={'full'}
                  h={'25px'}
                  onClick={handlePrint}>
                  Print
                </Button>
                <div style={{ display: 'none', margin: '100px' }}>
                  <ComponentToPrint
                    ref={componentRef}
                    description={description}
                    user={user}
                    board={board}
                    questions={inputList}
                  />
                </div>
              </Box>
            </ListItem>
            <ListItem>
              <Button
                fontFamily={'heading'}
                bg={'gray.200'}
                color={'gray.800'}
                border="1px"
                borderColor="gray.300"
                _hover={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
                w={'full'}
                h={'25px'}
                onClick={copyQuillText}>
                Copy
              </Button>
            </ListItem>
          </List>
        </Box>
      );
    };

    const handleClick = (url) => {
      if (quill) {
        const range = quill?.getSelection();
        const position = range ? range.index : 0;
        const finalPosition = position;
        toDataURL(url, function (dataUrl) {
          quill.insertEmbed(finalPosition, 'image', dataUrl);
        });
      }
    };

    const imageSketches = () => {
      return (
        <Menu matchWidth={true}>
          <MenuButton
            display={'flex'}
            as={Button}
            w={'full'}
            h={'25px'}
            bg={'gray.200'}
            _hover={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
            border="1px"
            borderColor="gray.300"
            rightIcon={<AiOutlineDown />}>
            Insert Sketch
          </MenuButton>
          <MenuList display={'auto'}>
            <SimpleGrid columns={4} spacing={3}>
              {LocalImages.map((image) => {
                return (
                  <Image
                    boxSize="50px"
                    src={image.image}
                    alt={image.image}
                    key={image.id}
                    onClick={() => handleClick(image.image)}
                    _hover={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
                  />
                );
              })}
            </SimpleGrid>
          </MenuList>
        </Menu>
      );
    };

    return (
      <div id="content">
        <Modal
          size="xl"
          onClose={handleModalClose}
          isOpen={isOpen}
          isCentered
          scrollBehavior={'inside'}>
          <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(20px) hue-rotate(90deg)" />
          {/* https://github.com/chakra-ui/chakra-ui/discussions/2676 */}
          <ModalContent display="flex" maxW="70rem" borderBlock={10}>
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
              <Box display={'flex'}>
                <InsertCheckBox inputList={inputList} setInputList={setInputList} />
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
                      quill={quill}
                      quillRef={quillRef}
                      Quill={Quill}
                    />
                  </Box>
                </Box>
                <Box
                  marginTop={5}
                  width={'200px'}
                  height={'120px'}
                  display="flex"
                  bg={'gray.50'}
                  flexDirection="column"
                  border={'1px'}
                  borderColor="gray.400">
                  <List spacing={1}>
                    <ListItem>
                      <Text alignContent={'center'} align={'center'} color={'black'}>
                        Insert
                      </Text>
                    </ListItem>
                    <CardLabel id={card._id} boardId={card.boardId} />
                    <ListItem>
                      <Button
                        fontFamily={'heading'}
                        bg={'gray.200'}
                        color={'gray.800'}
                        _hover={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
                        border="1px"
                        borderColor="gray.300"
                        w={'full'}
                        h={'25px'}
                        onClick={() => {
                          setInputList([...inputList, { value: '', checked: false }]);
                        }}>
                        Checkbox
                      </Button>
                    </ListItem>
                    <ListItem>{imageSketches()}</ListItem>
                  </List>
                  <br />
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
      </div>
    );
  }
};
export default CardDetailsModal;
