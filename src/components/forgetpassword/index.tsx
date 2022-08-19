import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
  VStack
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
const ForgetPassword = (): JSX.Element => {
  const toast = useToast();
  const [isloading, setIsloading] = React.useState(false);
  const data = {
    email: ''
  };
  const handelChange = async (e) => {
    setIsloading(true);
    const url = `/api/forget`;

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
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.message === 'success') {
      setIsloading(false);
      toast({
        title: 'Email sent',
        description: 'Please Check your Email to change your password.',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    } else {
      toast({
        title: 'Error',
        description: result.message,
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    }
    console.log(result);
  };
  return (
    <>
      <Box rounded="lg" w={'100%'}>
        <Box display="flex">
          <Image
            height="70px"
            ml="auto"
            mr="auto"
            src="/brandname.png"
            display="inline-block"
            alt="brand logo"
          />
        </Box>
        <Flex align="center" justify="center" h="50vh">
          <Box bg="white" p={6} rounded="md" w="500px">
            <VStack spacing={4} align="flex-start">
              <FormControl>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                  onChange={(e) => {
                    data.email = e.target.value;
                  }}
                />
              </FormControl>
              <Button
                isLoading={isloading}
                colorScheme="purple"
                width="full"
                loadingText="Sending..."
                onClick={handelChange}>
                ForgetPassword
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ForgetPassword;
