import { useQuill } from 'react-quilljs';
import React from 'react';
import 'quill/dist/quill.snow.css';
import { Avatar, Box, Button, IconButton, Image, keyframes, Tooltip } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { AiOutlineAudio, AiOutlineAudioMuted, AiOutlineDown } from 'react-icons/ai';

const QuillEditor = ({
  value,
  onChange,
  quillContent,
  inputList,
  setInputList,
  quillText,
  quill,
  quillRef
}) => {
  const toast = useToast();
  const pulseRing = keyframes`
	0% {
    transform: scale(0.33);
  }
  40%,
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
	`;
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
    isMicrophoneAvailable
  } = useSpeechRecognition();
  // const { quill, quillRef, Quill } = useQuill();
  React.useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value);
      quillContent(quill.getContents());
      quillText(quill.getText());
      // console.log('Text', quill.getText());
    }
  }, [quill]);
  React.useEffect(() => {
    if (listening && quill) {
      const range = quill?.getSelection();
      const position = range ? range.index : 0;
      // console.log('position ' + position);
      const finalPosition = position;
      // console.log(finalTranscript);
      quill.insertText(finalPosition, ' ' + finalTranscript);
      resetTranscript();
    }
  }, [finalTranscript]);

  function changeText(text) {
    onChange(text);
  }
  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        quillContent(quill.getContents());
        quillText(quill.getText());
        changeText(quill.root.innerHTML);
      });
    }
  }, [quill]);
  const listen = () => {
    if (
      browserSupportsContinuousListening &&
      isMicrophoneAvailable &&
      browserSupportsSpeechRecognition
    ) {
      if (!listening) {
        SpeechRecognition.startListening({ continuous: true });
      }
    } else {
      toast({
        title: 'Browser not supported',
        description: 'Your browser does not support speech recognition',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    }
  };
  const stop = () => {
    if (browserSupportsContinuousListening) {
      if (listening) {
        SpeechRecognition.stopListening();
        resetTranscript();
      }
      console.log('browserSupportsContinuousListening');
    }
  };
  return (
    <Box mx={'auto'}>
      <Box resize="vertical" width="95%" height="200px" overflow="auto">
        <Box ref={quillRef}></Box>
      </Box>
      <Box w="95%">
        <hr />
      </Box>

      <br></br>
      <Box display={'flex'}>
        <Box>
          <br />
        </Box>
        <Tooltip
          hasArrow
          bg="gray.300"
          color="black"
          label={listening ? 'Stop' : 'Start'}
          placement="right-end">
          <IconButton
            spinner={listening}
            variant="outline"
            display={'flex'}
            marginLeft={'45%'}
            bg={listening ? 'red.300' : 'green.200'}
            _hover={{ boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.5)' }}
            h={'80px'}
            w={'80px'}
            isRound={true}
            loadingText="Submitting"
            colorScheme={listening ? 'red' : 'black'}
            aria-label="Call Sage"
            fontSize="20px"
            icon={
              listening ? <AiOutlineAudio size={'50px'} /> : <AiOutlineAudioMuted size={'50px'} />
            }
            onClick={listening ? stop : listen}
          />
        </Tooltip>
        {listening ? (
          <Box
            as="div"
            margin={'15px'}
            w={'15px'}
            h={'15px'}
            _before={{
              content: "''",
              position: 'relative',
              display: 'block',
              width: '300%',
              height: '300%',
              boxSizing: 'border-box',
              marginLeft: '-100%',
              marginTop: '-100%',
              borderRadius: '50%',
              bgColor: 'red',
              animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`
            }}></Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default QuillEditor;
