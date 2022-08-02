import { useReactToPrint } from 'react-to-print';
import FileSaver, { saveAs, FileSaverOptions } from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';
// import quillToWord from 'quill-to-word';

export const handelPDFConverter = async (data, title) => {
  const pdfAsBlob = await pdfExporter.generatePdf(data); // converts to PDF
  await saveAs(pdfAsBlob, title);
};
// export const handelWordConverter = async (data, title) => {
//   const fileToBlob = async (file) =>
//     new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });
//   const data1 = await quillToWord.generateWord(data, { exportAs: 'blob' });
//   const blob = await fileToBlob(data1);
//   await saveAs(blob, title);
// };
