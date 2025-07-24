import styled from "styled-components";
import { useRef, useState } from "react";

const FileInputWrapper = styled.div`
  display: flex;
  width: ${({ $width }) => $width || "100%"};
  border: var(--border-normal);
  border-radius: var(--radius-normal);
  overflow: hidden;
  background-color: ${({ disabled }) =>
    disabled ? "var(--color-gray-light)" : "white"};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  ${({ $error }) =>
    $error &&
    `
    border-color: var(--color-danger) !important;
  `}

  &:hover {
    border-color: var(--color-primary);
  }

  &:focus-within {
    border-color: var(--color-primary);
    outline: var(--border-primary);
  }
`;

const FileText = styled.div`
  flex: 1;
  padding: 10px 12px;
  color: ${({ $placeholder }) => ($placeholder ? "#999999" : "inherit")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileButton = styled.button`
  background-color: #e6e6e6;
  padding: 10px 12px;
  cursor: pointer;

  &:disabled {
    color: #999999;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input.attrs({ type: "file" })`
  display: none;
`;

const FileField = ({
  id,
  name,
  onChange,
  onBlur,
  error = false,
  disabled = false,
  width = "100%",
  placeholder = "Chưa có tệp nào",
  accept,
}) => {
  const inputRef = useRef();
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
    onChange?.(e);
  };

  return (
    <>
      <HiddenInput
        id={id || name}
        name={name}
        ref={inputRef}
        onChange={handleFileChange}
        onBlur={onBlur}
        disabled={disabled}
        accept={accept}
      />
      <FileInputWrapper $width={width} $error={error} disabled={disabled}>
        <FileText $placeholder={!fileName}>{fileName || placeholder}</FileText>
        <FileButton
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Chọn tệp
        </FileButton>
      </FileInputWrapper>
    </>
  );
};

export default FileField;
