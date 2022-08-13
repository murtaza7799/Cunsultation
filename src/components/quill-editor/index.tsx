import { useQuill } from 'react-quilljs';
import React from 'react';
import 'quill/dist/quill.snow.css';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Image,
  keyframes,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { AiOutlineAudio, AiOutlineAudioMuted, AiOutlineDown } from 'react-icons/ai';
import InsertCheckBox from './DynamicCheckbox';
import LocalImages from './images';

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
  // if (!browserSupportsSpeechRecognition) {
  //   // eslint-disable-next-line react/no-unescaped-entities
  //   return <span>Browser doesn't support speech recognition.</span>;
  // }
  // function toDataURL(url, callback) {
  //   const xhr = new XMLHttpRequest();
  //   xhr.onload = function () {
  //     const reader = new FileReader();
  //     reader.onloadend = function () {
  //       callback(reader.result);
  //     };
  //     reader.readAsDataURL(xhr.response);
  //   };
  //   xhr.open('GET', url);
  //   xhr.responseType = 'blob';
  //   xhr.send();
  // }
  // const handleClick = (url) => {
  //   if (quill) {
  //     const range = quill?.getSelection();
  //     const position = range ? range.index : 0;
  //     // console.log('position ' + position);
  //     const finalPosition = position;
  //     // });
  //     toDataURL(url, function (dataUrl) {
  //       quill.insertEmbed(finalPosition, 'image', dataUrl);
  //     });
  //   }
  // };
  // const imageSketches = () => {
  //   return (
  //     <Menu>
  //       <MenuButton display={'flex'} as={Button} size="xs" rightIcon={<AiOutlineDown />}>
  //         Insert Sketch
  //       </MenuButton>
  //       <MenuList zIndex="dropdown" maxHeight={'60vh'} overflowY={'scroll'}>
  //         {LocalImages.map((data) => (
  //           <MenuItem key={data.id}>
  //             <Image
  //               objectFit="cover"
  //               boxSize="200px"
  //               src={data.image}
  //               alt="loading....."
  //               onClick={() => handleClick(data.image)}
  //             />
  //           </MenuItem>
  //         ))}
  //       </MenuList>
  //     </Menu>
  //   );
  // };
  return (
    <Box mx={'auto'}>
      <Box className="text-editor" width="95%">
        <div ref={quillRef} />
      </Box>
      <br></br>
      <Box display={'flex'}>
        <Box>
          {/* {imageSketches()} */}
          <br />
          {/* <InsertCheckBox inputList={inputList} setInputList={setInputList} /> */}
        </Box>
        <IconButton
          spinner={listening}
          variant="outline"
          display={'flex'}
          marginLeft={'50%'}
          bg={listening ? 'red.300' : 'green.200'}
          h={'80px'}
          w={'80px'}
          isRound={true}
          _hover={{ bg: 'green.300' }}
          loadingText="Submitting"
          colorScheme={listening ? 'red' : 'black'}
          aria-label="Call Sage"
          fontSize="20px"
          icon={
            listening ? <AiOutlineAudio size={'50px'} /> : <AiOutlineAudioMuted size={'50px'} />
          }
          onClick={listening ? stop : listen}
        />
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
