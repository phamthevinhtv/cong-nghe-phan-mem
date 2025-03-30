import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  border: var(--border-normal);
  border-color: ${(props) => props.backgroundColor || 'var(--primary-color)'};
  background-color: ${(props) => props.backgroundColor || 'var(--primary-color)'}; 
  width: ${(props) => props.width || '100%'};
  margin: ${(props) => props.margin || '0px 0px 0px 0px'};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

const Button = ({ children, onClick, backgroundColor, width, margin, ...props }) => {
  return (
    <StyledButton onClick={onClick} backgroundColor={backgroundColor}   width={width} margin={margin} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
