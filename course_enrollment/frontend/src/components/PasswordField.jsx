import { useState, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  width: ${({ $width }) => $width || "100%"};
`;

const Input = styled.input`
  padding: 10px 38px 10px 10px;
  border: var(--border-normal);
  border-radius: var(--radius-normal);
  width: 100%;

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
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  padding: 9px;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: var(--radius-normal);
  border-bottom-right-radius: var(--radius-normal);

  &:disabled {
    cursor: not-allowed;
  }
`;

const Icon = styled.span`
  font-size: var(--font-size-large);
  color: #999999;
`;

const PasswordField = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = "Nhập mật khẩu",
  error = false,
  disabled = false,
  width = "100%",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef(null);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
    inputRef.current?.focus();
  };

  return (
    <Wrapper $width={width}>
      <Input
        id={id || name}
        name={name}
        ref={inputRef}
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        $error={error}
        disabled={disabled}
        autoComplete="current-password"
      />
      <ToggleButton
        onClick={toggleVisibility}
        disabled={disabled}
        type="button"
        aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        <Icon className="material-symbols-outlined">
          {isVisible ? "visibility" : "visibility_off"}
        </Icon>
      </ToggleButton>
    </Wrapper>
  );
};

export default PasswordField;
