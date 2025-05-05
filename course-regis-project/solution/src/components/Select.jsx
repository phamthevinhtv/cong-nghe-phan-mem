import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  width: ${(props) => props.width || '100%'};
  margin: ${(props) => props.margin};
`;

const SelectBox = styled.div`
  border: var(--border-normal);
  padding: 7.6px;
  border-radius: 6px;
  cursor: pointer;
  background-color: var(--white-color);
  
  &:hover {
    border-color: var(--primary-color) !important;
  }
`;

const Dropdown = styled.ul`
  border: var(--border-normal);
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  border-radius: 6px;
  z-index: 1;
  box-shadow: var(--shadow-normal);
`;

const Option = styled.li`
  padding: 8px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#f0f0f0" : "white")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};

  &:hover {
    background: #f0f0f0;
  }

  border-top-left-radius: ${(props) => (props.isFirst ? "6px" : "0")};
  border-top-right-radius: ${(props) => (props.isFirst ? "6px" : "0")};
  border-bottom-left-radius: ${(props) => (props.isLast ? "6px" : "0")};
  border-bottom-right-radius: ${(props) => (props.isLast ? "6px" : "0")};
`;

const Select = ({ name, options, value, onChange, placeholder, width, margin, clear = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setIsOpen(false);
  };

  const handleRightClick = (e) => {
    e.preventDefault(); 
    if(clear) {
      onChange({ target: { name, value: null } });
    }
  };

  return (
    <Wrapper ref={ref} margin={margin} width={width}>
      <SelectBox 
        id={name} 
        onClick={() => setIsOpen((prev) => !prev)} 
        onContextMenu={handleRightClick} 
        style={{ borderColor: `${isOpen ? "var(--primary-color)" : ""}` }}
      >
        {selected ? selected.label : <span style={{ color: '#6e6e6e' }}>{placeholder}</span>}
      </SelectBox>
      {isOpen && (
        <Dropdown>
          {options.length === 0 ? (
            <Option isFirst isLast style={{ cursor: 'default', color: '#6e6e6e' }}>
              Không có dữ liệu
            </Option>
          ) : (
            options.map((option, index) => (
              <Option
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option.value);
                }}
                active={option.value === value}
                isFirst={index === 0}
                isLast={index === options.length - 1}
              >
                {option.label}
              </Option>
            ))
          )}
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default Select;
