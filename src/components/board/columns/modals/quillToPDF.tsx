import { pdfExporter } from 'quill-to-pdf';
import { saveAs } from 'file-saver';
import { MenuItem } from '@chakra-ui/react';
const pdf = typeof window === 'object' ? require('html-pdf') : () => false;
const QuillPDF = ({ quilldata, title }) => {
  const saveAsPdf = async () => {
    if (typeof window !== 'undefined') {
      console.log(quilldata);
      try {
        const options = { format: 'Letter' };
        pdf.create(quilldata, options).toFile('./businesscard.pdf', function (err, res) {
          if (err) return console.log(err);
          console.log(res); // { filename: '/app/businesscard.pdf' }
        });
        // const data = await pdfExporter.generatePdf(quilldata);
        // await saveAs(data, title);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return <MenuItem onClick={saveAsPdf}>Save as PDF</MenuItem>;
};

export default QuillPDF;
