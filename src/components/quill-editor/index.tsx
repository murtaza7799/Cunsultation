import { useQuill } from 'react-quilljs';
import React from 'react';
import 'quill/dist/quill.snow.css';
import {
  Box,
  Button,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text
} from '@chakra-ui/react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { AiOutlineAudio, AiOutlineAudioMuted, AiOutlineDown } from 'react-icons/ai';
import InsertCheckBox, { getBase64Image } from './DynamicCheckbox';
import BlotFormatter from 'quill-blot-formatter';
import LocalImages from './images';

const QuillEditor = ({ value, onChange, quillContent, inputList, setInputList, images }) => {
  // const [url, setUrl] = React.useState([]);
  // console.log('images', images);
  const {
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    SpeechRecognition
  } = useSpeechRecognition();
  // if (typeof window !== 'undefined')
  const { quill, quillRef, Quill } = useQuill();
  if (typeof window === 'object') {
    console.log('unsupported');
    // if (Quill && !quill) Quill.register('modules/blotFormatter', BlotFormatter);
  }
  React.useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value);
      quillContent(quill.getContents());
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
    console.log(value);
  }
  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        console.log('content changed');
        quillContent(quill.getContents());

        changeText(quill.root.innerHTML);
      });
    }
  }, [quill]);
  const listen = () => {
    if (SpeechRecognition.browserSupportsContinuousListening) {
      if (!listening) {
        console.log('listening');
        SpeechRecognition.startListening({ continuous: true });
      }
    }
  };
  const stop = () => {
    if (SpeechRecognition.browserSupportsContinuousListening) {
      if (listening) {
        SpeechRecognition.stopListening();
        resetTranscript();
      }
      console.log('browserSupportsContinuousListening');
    }
  };
  if (!browserSupportsSpeechRecognition) {
    // eslint-disable-next-line react/no-unescaped-entities
    return <span>Browser doesn't support speech recognition.</span>;
  }
  function toDataURL(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  const handleClick = (url) => {
    console.log(url);
    if (quill) {
      const range = quill?.getSelection();
      const position = range ? range.index : 0;
      console.log('position ' + position);
      const finalPosition = position;
      // });
      toDataURL(url, function (dataUrl) {
        console.log('RESULT:', dataUrl);
        quill.insertEmbed(finalPosition, 'image', dataUrl);
      });
    }
  };
  const imageSketches = () => {
    return (
      <Menu>
        <MenuButton display={'flex'} as={Button} size="xs" rightIcon={<AiOutlineDown />}>
          Insert Sketch
        </MenuButton>
        <MenuList zIndex="dropdown" maxHeight={'60vh'} overflowY={'scroll'}>
          {LocalImages.map((data) => (
            <MenuItem key={data.id}>
              <Image
                objectFit="cover"
                boxSize="200px"
                src={data.image}
                alt="loading....."
                onClick={() => handleClick(data.image)}
              />
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  };

  return (
    <Box mx={'auto'}>
      <Box className="text-editor" width="95%">
        <div ref={quillRef} />
      </Box>
      <br></br>
      <Box display={'flex'}>
        <Box>
          {/* {images !== undefined && imageSketches()} */}
          {imageSketches()}
          <br />
          <InsertCheckBox inputList={inputList} setInputList={setInputList} />
        </Box>
        <IconButton
          spinner={listening}
          variant="outline"
          display={'flex'}
          marginLeft={'10%'}
          size="lg"
          isRound={true}
          _hover={{ bg: 'teal.100' }}
          loadingText="Submitting"
          colorScheme={listening ? 'red' : 'teal'}
          aria-label="Call Sage"
          fontSize="20px"
          icon={listening ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}
          onClick={listening ? stop : listen}
        />
      </Box>
    </Box>
  );
};

export default QuillEditor;
