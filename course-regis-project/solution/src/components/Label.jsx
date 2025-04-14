import styled from 'styled-components';

const StyledLabel = styled.label`
    display: flex;
    flex-direction: ${(props) => props.direction || 'column'};
    gap: ${(props) => props.gap};
    margin: ${(props) => props.margin};
    justify-content: ${(props) => props.justifyContent || 'flex-start'};
    align-items: ${(props) => props.alignItem || 'baseline'};
`;

const Label = ({ children, htmlFor, direction, margin, gap, justifyContent, alignItem, ...props }) => {
  return (
    <StyledLabel htmlFor={htmlFor} alignItem={alignItem} justifyContent={justifyContent} margin={margin} direction={direction} gap={gap} {...props}>
      {children}
    </StyledLabel>
  );
};

export default Label;
