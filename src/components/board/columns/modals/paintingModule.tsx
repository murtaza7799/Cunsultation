import { Box, Button } from '@chakra-ui/react';
import * as React from 'react';
import { BsPencil } from 'react-icons/bs';
import FileResizer from 'react-image-file-resizer';
import { ReactPainter } from 'react-painter';
import styles from './cursor.module.scss';
import Undo from './undoRedo';
const Painting = ({ url, quill, setModel }) => {
  const canvasRef = React.useRef(null);
  const file = async (blob) => {
    const myFile = new File([blob], 'image.jpeg', {
      type: blob.type
    });
    // console.log(await resizeFile(myFile));
    if (quill) {
      console.log(canvasRef.current);
      // setModel(false);
      // const range = quill?.getSelection();
      // const position = range ? range.index : 0;
      // const finalPosition = position;
      // const url = await resizeFile(myFile);
      // quill.insertEmbed(finalPosition, 'image', url);
    }
  };
  return (
    <Box>
      <ReactPainter
        width={500}
        height={500}
        onSave={(blob) => file(blob)}
        image={url}
        render={({ triggerSave, canvas, setColor, getCanvasProps }) => (
          <Box className={styles.png}>
            <div>
              <text
                style={{ justifyContent: 'space-between', marginTop: '10px', fontSize: '20px' }}>
                Select Pen Color :{' '}
              </text>
              <input type="color" title="Colors" onChange={(e) => setColor(e.target.value)} />
              <hr />
            </div>
            <Box bg={'white'}>
              <div style={{ justifyContent: 'space-between', marginTop: '10px' }}>
                <canvas className="paint" {...getCanvasProps({ ref: (ref) => canvasRef })} />
              </div>
            </Box>
            <hr></hr>
            <Box m={5} display={'flex'} marginLeft={'74%'} marginTop={'15%'}>
              <Button
                bgGradient="linear(to-r, red.400,pink.400)"
                _hover={{
                  bgGradient: 'linear(to-r, red.400,pink.400)',
                  boxShadow: 'xl'
                }}
                color={'white'}
                alignSelf={'baseline'}
                onClick={triggerSave}>
                Insert Sketch
              </Button>
            </Box>
          </Box>
        )}
      />
    </Box>
  );
};
export default Painting;
const resizeFile = (file) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file,
      200,
      200,
      'PNG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'base64'
    );
  });
