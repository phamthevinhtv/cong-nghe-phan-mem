import styled from "styled-components";

const Input = styled.input`
  padding: 10px 12px;
  border: var(--border-normal);
  border-radius: var(--radius-normal);
  width: ${({ $width }) => $width || "100%"};

  &:hover {
    border-color: var(--color-primary);
  }

  &:focus {
    border-color: var(--color-primary);
    outline: var(--border-primary);
  }

  ${({ $error }) =>
    $error &&
    `
    border-color: var(--color-danger) !important;
    outline-color: var(--color-danger) !important;
    color: var(--color-danger) !important;
  `}

  &:disabled {
    background-color: var(--color-gray-light);
    cursor: not-allowed;
    border: var(--border-normal);
  }
`;

const TextField = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = "Nhập văn bản",
  type = "text",
  error = false,
  disabled = false,
  width = "100%",
}) => {
  return (
    <Input
      id={id || name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      $error={error}
      disabled={disabled}
      $width={width}
    />
  );
};

export default TextField;
