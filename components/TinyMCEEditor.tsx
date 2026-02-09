//used in product form

'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

export default function RichTextEditor({
  value,
  onChange,
  height = 180,
  placeholder = 'Write description here...',
}) {
  const editorRef = useRef(null);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINY_MMC_API_KEY}
      value={value}
      onInit={(evt, editor) => (editorRef.current = editor)}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: height,
        menubar: true,
        placeholder: placeholder,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic underline | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image media | code fullscreen',
        content_style:
          'body { font-family: Inter, Arial, sans-serif; font-size: 14px }',
      }}
    />
  );
}
