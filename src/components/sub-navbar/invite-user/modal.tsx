import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  useToast
} from '@chakra-ui/react';
import { useAppSelector } from '@/src/hooks';

const InviteModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [isMailSending, setMailSending] = useState(false);
  const board = useAppSelector((state) => state.board.board);
  const user = useAppSelector((state) => state.user);
  const toast = useToast();

  const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

  const handleClick = async () => {
    setMailSending(true);
    if (email === user?.email) {
      setEmailErr(true);
      setMailSending(false);
      return;
    }
    await sendEmail();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    validate();
  };
  const validate = () => {
    if (!validEmail.test(email)) {
      setEmailErr(true);
    } else {
      setEmailErr(false);
    }
  };

  const sendEmail = async () => {
    const url = `/api/mail`;

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
      body: JSON.stringify({ email, boardId: board._id })
    });

    const inJSON = await response.json();

    if (inJSON.status === 400) {
      toast({
        title: 'Alert !',
        description: "User doesn't exist",
        status: 'error',
        duration: 9000,
        isClosable: true
      });
      setMailSending(false);
    }

    if (inJSON.status === 200) {
      onClose();
      setEmail('');
      toast({
        title: 'Alert !',
        description: 'User Added Successfully',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen} size="xs" ml="5px">
        Invite
      </Button>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </ModalBody>
          {emailErr && <p>{emailErr}</p>}
          <ModalFooter>
            <Button
              disabled={!validEmail.test(email)}
              colorScheme="blue"
              mr={3}
              onClick={handleClick}
              isLoading={isMailSending}
              loadingText="Sending">
              Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InviteModal;
