import React, { useRef, useEffect, useState } from 'react';
import JoditEditorLib from 'jodit-react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: ${(props) => props.margin};
`;

const JoditEditor = ({ value, onChange, viewMode, name, margin }) => {
  const editor = useRef(null);
  const [editorValue, setEditorValue] = useState(value || '');

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleEditorChange = (content) => {
    setEditorValue(content);
    onChange({ target: { name, value: content } });
  };

  return (
    <Wrapper margin={margin}>
      {viewMode ? (
        <div dangerouslySetInnerHTML={{ __html: editorValue }} />
      ) : (
        <JoditEditorLib
          ref={editor}
          value={editorValue}
          onBlur={handleEditorChange} 
          config={{
            readonly: false,
          }}
          name={name}
          id={name}
        />
      )}
    </Wrapper>
  );
};

export default JoditEditor;
