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
  MenuList
} from '@chakra-ui/react';
import { useSpeechRecognition } from 'react-speech-recognition';
import { AiOutlineAudio, AiOutlineAudioMuted, AiOutlineDown } from 'react-icons/ai';
import InsertCheckBox from './DynamicCheckbox';
import LocalImages from './images';

const QuillEditor = ({ value, onChange, quillContent, inputList, setInputList, quillText }) => {
  const {
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    SpeechRecognition
  } = useSpeechRecognition();
  // if (typeof window !== 'undefined')
  const { quill, quillRef, Quill } = useQuill();
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
    if (SpeechRecognition.browserSupportsContinuousListening) {
      if (!listening) {
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
    if (quill) {
      const range = quill?.getSelection();
      const position = range ? range.index : 0;
      // console.log('position ' + position);
      const finalPosition = position;
      // });
      toDataURL(url, function (dataUrl) {
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
