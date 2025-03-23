import styled from 'styled-components';

const RadioGroupContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || 'column'};
  gap: ${(props) => props.gap || '0px'}; 
  margin: ${(props) => props.margin || '0px 0px 0px 0px'};
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

const RadioGroup = ({ name, options, value, onChange, gap, direction, margin, ...props }) => {
    
    return (
    <RadioGroupContainer gap={gap} direction={direction} margin={margin} {...props}>
      {options.map((option) => (
        <RadioLabel key={option.value}>
          <RadioInput
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
          />
          {option.label}
        </RadioLabel>
      ))}
    </RadioGroupContainer>
  );
};

export default RadioGroup;
