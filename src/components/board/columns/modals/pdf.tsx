import React from 'react';
import jsPDF from 'jspdf';
import { Box, Button, Flex } from '@chakra-ui/react';
const print = () => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  pdf.html(document.getElementById('content'), {
    callback: function (doc) {
      doc.save('document.pdf');
    }
  });
};

const PDFDocument = ({ description }) => {
  return (
    <Box alignItems="center" gap="2" mr={20} marginTop={10} display="contents">
      <Box>
        <div id="content">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </Box>
      <Flex alignItems="center" gap="2" display={'flex'} width={'full'}>
        <Button
          colorScheme="teal"
          alignContent="right"
          onClick={() => {
            print();
          }}>
          Save
        </Button>
      </Flex>
    </Box>
  );
};

export default PDFDocument;
