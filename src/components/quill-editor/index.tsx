import { useQuill } from 'react-quilljs';
import React from 'react';
import 'quill/dist/quill.snow.css';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const QuillEditor = ({ value, onChange }) => {
  const {
    finalTranscript,
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const { quill, quillRef } = useQuill();
  // const childRef = useRef<CanShowAlert>(null);
  console.log('test');
  React.useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [quill]);
  React.useEffect(() => {
    if (listening && quill) {
      const range = quill?.getSelection();
      const position = range ? range.index : 0;
      console.log('position ' + position);
      const finalPosition = position;
      console.log(finalTranscript);
      quill.insertText(finalPosition, ' ' + finalTranscript);
      resetTranscript();
    }
  }, [finalTranscript]);

  function changeText(text) {
    onChange(text);
    // quill.setContents(delta, 'silent');
    console.log(value);
  }

  React.useEffect(() => {
    if (quill) {
      console.log(finalTranscript);
      quill.on('text-change', (delta, oldDelta, source) => {
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

  return (
    <Box mx={'auto'}>
      <Box className="text-editor" width="95%">
        <div ref={quillRef} />
      </Box>
      <Box>
        <br></br>
        <Button colorScheme="teal" variant="solid" onClick={listen}>
          Start
        </Button>
        <Button colorScheme="teal" variant="solid" onClick={stop}>
          Stop
        </Button>
      </Box>
    </Box>
  );
};

export default QuillEditor;
