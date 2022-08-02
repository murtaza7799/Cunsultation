import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Checkbox, CheckboxGroup, Input, Stack } from '@chakra-ui/react';
import styles from './checkbox.module.scss';
InsertCheckBox.propTypes = {
  values: PropTypes.array.isRequired
};
export default function InsertCheckBox({ inputList, setInputList }) {
  // handle input change
  console.log('inputlist at chck box', inputList);
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    console.log(name, value);

    const list = [...inputList];
    list[index][name] = value;
    console.log(list);
    setInputList(list);
  };

  // handle checkbox change
  const handleCheckboxChange = (e, index) => {
    const { checked } = e.target;
    const list = [...inputList];
    list[index].checked = checked;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
    console.log();
    // department(list, values);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { value: '', checked: false }]);
  };

  return (
    <div>
      {inputList.map((x, i) => {
        {
          i === 0 ? <div>TEST0</div> : <div>TEST1</div>;
        }
        return (
          // eslint-disable-next-line react/jsx-key
          <div className="box">
            <Box display={'flex'}>
              <Box>
                <Input
                  placeholder="Write your text here.."
                  label="Department Name"
                  variant="filled"
                  fullWidth
                  name="value"
                  value={x.value}
                  onChange={(e) => handleInputChange(e, i)}
                />
              </Box>

              <br />
              <Box display={'flex'} marginRig={5}>
                <section title=".squaredTwo">
                  <div className={styles.squaredTwo}>
                    <Checkbox
                      mr={5}
                      colorScheme="green"
                      onChange={(e) => handleCheckboxChange(e, i)}></Checkbox>
                  </div>
                </section>
              </Box>
            </Box>
            <div>
              {inputList.length !== 1 && (
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme="red"
                  onClick={() => handleRemoveClick(i)}>
                  Remove
                </Button>
              )}
              {inputList.length - 1 === i && (
                <Button size="xs" colorScheme="telegram" onClick={handleAddClick}>
                  Add
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
