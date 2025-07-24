import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const DropdownWrapper = styled.div`
  position: relative;
  width: ${({ $width }) => $width || "100%"};
  min-width: 150px;
`;

const DropdownButton = styled.div`
  padding: 10px;
  border: var(--border-normal);
  border-radius: var(--radius-normal);
  background-color: white;
  cursor: pointer;
  font-size: 16px;
  color: ${({ $hasValue }) => ($hasValue ? "inherit" : "#999999")};

  &:hover {
    border-color: var(--color-primary);
  }

  ${({ $isOpen }) =>
    $isOpen &&
    `
    border-color: var(--color-primary);
    outline: var(--border-primary);
  `}

  ${({ $error }) =>
    $error &&
    `
    border-color: var(--color-danger) !important;
    outline-color: var(--color-danger) !important;
    color: var(--color-danger) !important;
  `}

  ${({ $disabled }) =>
    $disabled &&
    `
    background-color: var(--color-gray-light);
    cursor: not-allowed;
    border: var(--border-normal) !important;
    outline: none;
  `}
`;

const DropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: white;
  border: var(--border-gray-light);
  border-radius: var(--radius-normal);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;

  ${({ $selected }) =>
    $selected
      ? `
        background-color: var(--color-primary);
        color: white;
        &:hover {
          opacity: 0.8;
          background-color: var(--color-primary);
        }
      `
      : `
        &:hover {
          background-color: var(--color-gray-light);
        }
      `}
`;

const EmptyMessage = styled.li`
  padding: 10px;
  color: var(--color-gray);
  cursor: default;
  text-align: center;
`;

const Dropdown = ({
  id,
  options = [],
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = "Chọn một mục",
  error = false,
  disabled = false,
  width = "100%",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onBlur]);

  const handleSelect = (option) => {
    if (!disabled) {
      onChange?.({ target: { value: option.value } });
      setIsOpen(false);
      onBlur?.();
    }
  };

  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        onFocus?.();
      } else {
        onBlur?.();
      }
    }
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <DropdownWrapper $width={width} ref={wrapperRef}>
      <DropdownButton
        id={id}
        $isOpen={isOpen}
        $error={error}
        $disabled={disabled}
        $hasValue={!!selectedOption}
        onClick={handleButtonClick}
      >
        <span>{selectedOption?.label || placeholder}</span>
      </DropdownButton>
      {isOpen && !disabled && (
        <DropdownList>
          {options.length === 0 ? (
            <EmptyMessage>Không có dữ liệu</EmptyMessage>
          ) : (
            options.map((option) => (
              <DropdownItem
                key={option.value}
                $selected={option.value === value}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </DropdownItem>
            ))
          )}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
};

export default Dropdown;
