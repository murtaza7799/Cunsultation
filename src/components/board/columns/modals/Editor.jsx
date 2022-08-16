import ReactQuill, { Quill } from 'react-quill';
import BlotFormatter from 'quill-blot-formatter';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/blotFormatter', BlotFormatter);

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  },
  blotFormatter: {}
};

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video'
];

const ReactQuillCustom = ({ value, onChange }) => (
  <ReactQuill
    modules={modules}
    formats={formats}
    theme="snow"
    readOnly={false}
    onChange={onChange}
    value={value}
  />
);
export default ReactQuillCustom;
/*
export default function ReactQuillCustom({ value, onChange }) {
  console.log("QuillCustom");
  return (
    <ReactQuill
      modules={modules}
      formats={formats}
      theme="snow"
      readOnly={false}
      onChange={onChange}
      value={value}
    />
  );
}
*/
