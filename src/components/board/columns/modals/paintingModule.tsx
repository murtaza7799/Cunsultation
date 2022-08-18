import { Box, Button } from '@chakra-ui/react';
import FileResizer from 'react-image-file-resizer';
import { ReactPainter } from 'react-painter';
import styles from './cursor.module.scss';
import React, { useEffect, useRef, useState } from 'react';
const Painting = ({ url, quill, setModel }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [undoSteps, setUndoSteps] = useState({});
  const [redoStep, setRedoStep] = useState({});

  const [undo, setUndo] = useState(0);
  const [redo, setRedo] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    console.log('useEffect');
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    console.log('startDrawing');
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    const temp = {
      ...undoSteps,
      [undo + 1]: []
    };
    temp[undo + 1].push({ offsetX, offsetY });
    setUndoSteps(temp);
    setUndo(undo + 1);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    console.log('draw');
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    const temp = {
      ...undoSteps
    };
    temp[undo].push({ offsetX, offsetY });
    setUndoSteps(temp);
  };

  const undoLastOperation = () => {
    if (undo > 0) {
      const data = undoSteps[undo];
      contextRef.current.strokeStyle = 'white';
      contextRef.current.beginPath();
      contextRef.current.lineWidth = 5;
      contextRef.current.moveTo(data[0].offsetX, data[0].offsetY);
      data.forEach((item, index) => {
        if (index !== 0) {
          contextRef.current.lineTo(item.offsetX, item.offsetY);
          contextRef.current.stroke();
        }
      });
      contextRef.current.closePath();
      contextRef.current.strokeStyle = 'black';
      const temp = {
        ...undoSteps,
        [undo]: []
      };
      const te = {
        ...redoStep,
        [redo + 1]: [...data]
      };
      setUndo(undo - 1);
      setRedo(redo + 1);
      setRedoStep(te);
      setUndoSteps(temp);
    }
  };

  const redoLastOperation = () => {
    if (redo > 0) {
      const data = redoStep[redo];
      contextRef.current.strokeStyle = 'black';
      contextRef.current.beginPath();
      contextRef.current.lineWidth = 5;
      contextRef.current.moveTo(data[0].offsetX, data[0].offsetY);
      data.forEach((item, index) => {
        if (index !== 0) {
          contextRef.current.lineTo(item.offsetX, item.offsetY);
          contextRef.current.stroke();
        }
      });
      contextRef.current.closePath();
      const temp = {
        ...redoStep,
        [redo]: []
      };
      setUndo(undo + 1);
      setRedo(redo - 1);
      setRedoStep(temp);
      setUndoSteps({
        ...undoSteps,
        [undo + 1]: [...data]
      });
    }
  };
  const file = async (blob) => {
    const myFile = new File([blob], 'image.jpeg', {
      type: blob.type
    });
    if (quill) {
      setModel(false);
      const range = quill?.getSelection();
      const position = range ? range.index : 0;
      const finalPosition = position;
      const url = await resizeFile(myFile);
      quill.insertEmbed(finalPosition, 'image', url);
    }
  };
  return (
    <Box>
      <Box>
        <p>check</p>
        <button type="button" disabled={undo === 0} onClick={undoLastOperation}>
          Undo
        </button>
        &nbsp;
        <button type="button" disabled={redo === 0} onClick={redoLastOperation}>
          Redo
        </button>
      </Box>
      <ReactPainter
        width={500}
        height={500}
        onSave={(blob) => file(blob)}
        image={url}
        render={({ triggerSave, canvas, setColor, getCanvasProps }) => (
          <Box className={styles.png}>
            {/* <div>
              <text
                style={{ justifyContent: 'space-between', marginTop: '10px', fontSize: '20px' }}>
                Select Pen Color :{' '}
              </text>
              <input type="color" title="Colors" onChange={(e) => setColor(e.target.value)} />
              <hr />
            </div> */}
            <Box bg={'white'}>
              <div style={{ justifyContent: 'space-between', marginTop: '10px' }}>
                <canvas
                  onMouseDown={startDrawing}
                  onMouseUp={finishDrawing}
                  onMouseMove={draw}
                  className="paint"
                  {...getCanvasProps({
                    ref: (ref) => {
                      canvasRef.current = ref;
                      setIsErasing(true);
                    }
                  })}
                />
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
