import React from 'react';
import { Box, Button, Checkbox, Input, Text } from '@chakra-ui/react';
export default function InsertCheckBox({ inputList, setInputList }) {
  const checkBoxNo = 'No';
  const checkBoxYes = 'Yes';
  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle checkbox change
  const handleCheckboxChange = (e, index, check) => {
    const { checked } = e.target;
    // console.log('checked', e.target.checked.toString());
    const list = [...inputList];
    if (check === 'Yes' && checked) {
      list[index].checked = true;
    } else if (check === 'No' && checked) {
      list[index].checked = false;
    }
    // console.log(list);
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
    // department(list, values);
  };

  // handle click event of the Add button
  // const handleAddClick = () => {
  //   setInputList([...inputList, { value: '', checked: false }]);
  // };

  return (
    <div>
      {inputList.map((x, i) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <Box className="box" margin={4} display={'flex'}>
            <Box display={'flex'}>
              <Box>
                <Input
                  placeholder="Write your text here.."
                  size="sm"
                  marginTop={1}
                  marginLeft="1rem"
                  fontWeight="bold"
                  name="value"
                  color={'black'}
                  value={x.value}
                  onChange={(e) => handleInputChange(e, i)}
                />
              </Box>

              <br />
              <Box display={'flex'} marginLeft={8}>
                <Checkbox
                  mr={3}
                  borderColor={'grey'}
                  defaultChecked={x.checked ? true : false}
                  name="checked Yes"
                  colorScheme="green"
                  onChange={(e) => handleCheckboxChange(e, i, checkBoxYes)}>
                  Yes
                </Checkbox>
              </Box>
              <Box display={'flex'} marginLeft={4}>
                <Checkbox
                  mr={3}
                  borderColor={'grey'}
                  name="checked No"
                  defaultChecked={x.checked ? false : true}
                  colorScheme="green"
                  onChange={(e) => handleCheckboxChange(e, i, checkBoxNo)}>
                  No
                </Checkbox>
              </Box>
            </Box>
            <div>
              {inputList.length !== 0 && (
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme="red"
                  margin={2}
                  onClick={() => handleRemoveClick(i)}>
                  Remove
                </Button>
              )}
            </div>
          </Box>
        );
      })}
    </div>
  );
}
// export const getBase64Image = (url) => {
//   const img = new Image();
//   img.setAttribute('crossOrigin', 'anonymous');
//   img.onload = () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0);
//     const dataURL = canvas.toDataURL(url);
//   };
//   img.src = url;
// };
