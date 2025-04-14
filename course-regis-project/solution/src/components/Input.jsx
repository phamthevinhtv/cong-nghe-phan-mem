import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: var(--border-normal);
  background-color: white;
  width: ${(props) => props.width || '100%'};
  margin: ${(props) => props.margin};

  &:focus {
    border-color: var(--primary-color);
  }

  &:hover {
    border-color: var(--primary-color);
  }
`;

const Input = ({ value, type = 'text', name, onChange, onBlur, placeholder, width, margin, ...props }) => {
  return (
    <StyledInput id={name} name={name} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} width={width} type={type} margin={margin} {...props} />
  );
};

export default Input;
