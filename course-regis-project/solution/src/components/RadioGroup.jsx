import { useState } from 'react';
import styled from 'styled-components';

const RadioGroupContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || 'column'};
  gap: ${(props) => props.gap}; 
  margin: ${(props) => props.margin};
  width: ${(props) => props.width || '100%'};
  border: var(--border-normal);
  border-radius: 6px;
  padding: 7.6px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
`;

const RadioGroup = ({ name, options, value, onChange, gap, direction, margin, width, ...props }) => {
  const [choose, setChoose] = useState(false);
  return (
    <RadioGroupContainer style={{borderColor: choose ? '#c8c8c8' : ''}}
    id={name} gap={gap} direction={direction} margin={margin} width={width} {...props}>
      {options.map((option) => (
        <RadioLabel key={option.value}>
          <RadioInput onClick={() => {if(option.value) {setChoose(true)}}} type="radio" name={name} value={option.value} checked={value === option.value} onChange={onChange} {...props}/>
          {option.label}
        </RadioLabel>
      ))}
    </RadioGroupContainer>
  );
};

export default RadioGroup;
